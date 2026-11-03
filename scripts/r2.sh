#!/usr/bin/env bash
# Reel media in a PRIVATE Cloudflare R2 bucket (owner, 3 Nov 2026: the repo is public, so the GitHub releases showed every reel, posted
# or not). Only the signed-in app serves the bucket (src/worker.js, binding REELS); it has no public access and no r2.dev URL.
# Keys: v/<file> = MP4 and review/contact-sheet PNG (an R2 lifecycle rule deletes them 15 days after upload),
#       c/<file> = cover JPG, config JSON, QA text, the minutes meter, rendered-at.json (kept). techreel/ and study/ files sit in
#       a folder of that name under v/ or c/ (v/techreel/<slug>.mp4 ...); the app lists only the top level.
# Needs CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID in the environment and `npm ci` done (wrangler from package.json).
# Usage:
#   bash scripts/r2.sh ensure                 bucket exists, r2.dev access off, the 15-day rule on v/ (pipeline, every deploy)
#   bash scripts/r2.sh check                  ensure, then write, read back and delete a test object: prints R2_OK=yes or R2_OK=no
#   bash scripts/r2.sh put <file> [key]       upload one file (key defaults to v/ or c/ + its name, by extension)
#   bash scripts/r2.sh get <key> <file>       download one object
#   bash scripts/r2.sh migrate [--delete]     copy every asset of the reels, techreel and study releases into the bucket, verify each one
#                                             (downloaded back, same bytes); with --delete, then remove the verified assets from the releases
set -uo pipefail
B=${R2_BUCKET:-aquarii-reels}
RULE=expire-v-15d
REPO=${REPO:-imshekharsingh/aquariit-templates}
w() { npx --no-install wrangler "$@"; }

keyfor() { # file name, optional folder -> key
  case "$1" in *.mp4|*.png) echo "v/${2:+$2/}$1";; *) echo "c/${2:+$2/}$1";; esac
}
ctype() {
  case "$1" in *.mp4) echo video/mp4;; *.png) echo image/png;; *.jpg|*.jpeg) echo image/jpeg;; *.json) echo 'application/json; charset=utf-8';;
    *.txt) echo 'text/plain; charset=utf-8';; *) echo application/octet-stream;; esac
}

ensure() {
  local out
  out=$(w r2 bucket list 2>&1) || { echo "$out"; echo "::error::R2: could not list buckets (is R2 enabled, and does the token have R2 Edit?)"; return 1; }
  if ! grep -qE "^name:\s+$B\s*$" <<<"$out"; then
    echo "Creating R2 bucket $B"
    w r2 bucket create "$B" || { echo "::error::R2: could not create the bucket $B"; return 1; }
  fi
  out=$(w r2 bucket dev-url get "$B" 2>&1) || { echo "$out"; return 1; }
  if ! grep -q "is disabled" <<<"$out"; then echo "r2.dev access was on: turning it off"; w r2 bucket dev-url disable "$B" --force || return 1; fi
  out=$(w r2 bucket lifecycle list "$B" 2>&1) || { echo "$out"; return 1; }
  if ! grep -qE "^name:\s+$RULE\s*$" <<<"$out"; then
    echo "Adding the lifecycle rule $RULE (objects under v/ expire 15 days after upload)"
    w r2 bucket lifecycle add "$B" "$RULE" v/ --expire-days 15 --force || { echo "::error::R2: could not add the lifecycle rule"; return 1; }
    out=$(w r2 bucket lifecycle list "$B" 2>&1)
  fi
  grep -A4 -E "^name:\s+$RULE\s*$" <<<"$out" || true
  echo "R2 bucket $B ready (private, v/ expires after 15 days)"
}

put() { # file [key]
  local f=$1 key=${2:-$(keyfor "$(basename "$1")")} i
  for i in 1 2 3; do
    w r2 object put "$B/$key" --file "$f" --content-type "$(ctype "$key")" --remote --force </dev/null >/dev/null 2>"$RUNNER_TMP_ERR" && { echo "R2 put $key ($(stat -c%s "$f") bytes)"; return 0; }
    echo "R2 put $key failed (try $i):"; tail -5 "$RUNNER_TMP_ERR"; sleep $((i * 5))
  done
  echo "::error::R2: could not upload $key"; return 1
}
get() { w r2 object get "$B/$1" --file "$2" --remote </dev/null >/dev/null 2>&1; }

check() {
  ensure || { echo "R2_OK=no"; return 1; }
  local t; t=$(mktemp); echo "r2 check $(date -u +%FT%TZ)" > "$t"
  put "$t" v/_check.txt && get v/_check.txt "$t.back" && cmp -s "$t" "$t.back" || { echo "R2_OK=no (write or read-back failed)"; return 1; }
  w r2 object delete "$B/v/_check.txt" --remote --force </dev/null >/dev/null 2>&1 || true
  echo "R2_OK=yes"
}

migrate() {
  local del=${1:-} tag id total=0 okall=0 dir aid name size at key f n m
  local W; W=$(mktemp -d); : > "$W/stamps.tsv"
  for tag in reels techreel study; do
    id=$(gh api "repos/$REPO/releases/tags/$tag" -q .id 2>/dev/null) || { echo "$tag: no release"; continue; }
    gh api --paginate "repos/$REPO/releases/$id/assets?per_page=100" -q '.[] | [.id, .name, .size, .updated_at] | @tsv' > "$W/$tag.tsv"
    : > "$W/$tag.ok"; dir=""; [ "$tag" = reels ] || dir=$tag
    n=$(wc -l < "$W/$tag.tsv")
    exec 3< "$W/$tag.tsv"
    while IFS=$'\t' read -r -u 3 aid name size at; do
      key=$(keyfor "$name" "$dir"); f="$W/file"
      gh api -H 'Accept: application/octet-stream' "repos/$REPO/releases/assets/$aid" > "$f" || { echo "::warning::$tag/$name: download failed"; continue; }
      [ "$(stat -c%s "$f")" = "$size" ] || { echo "::warning::$tag/$name: downloaded $(stat -c%s "$f") bytes, expected $size"; continue; }
      put "$f" "$key" || continue
      get "$key" "$W/back" && cmp -s "$f" "$W/back" || { echo "::warning::$key: read-back differs"; continue; }
      printf '%s\t%s\n' "$aid" "$key" >> "$W/$tag.ok"
      [ "$tag" = reels ] && printf '%s\t%s\n' "$name" "$at" >> "$W/stamps.tsv"
    done
    exec 3<&-
    m=$(wc -l < "$W/$tag.ok"); total=$((total + n))
    echo "MIGRATED $tag: $m of $n assets copied and verified"
    [ "$m" = "$n" ] && okall=$((okall + m)) || echo "::warning::$tag: $((n - m)) assets were not copied; none of this release's assets are deleted"
    if [ "$del" = "--delete" ] && [ "$m" = "$n" ]; then
      while IFS=$'\t' read -r aid key; do gh api -X DELETE "repos/$REPO/releases/assets/$aid" >/dev/null && echo "deleted release asset -> $key"; done < "$W/$tag.ok"
      echo "RELEASE $tag: $(gh api "repos/$REPO/releases/$id/assets?per_page=100" -q 'length') assets left"
    fi
  done
  # the original render time of each reel (R2 stamps a copy with today's date): the app sorts and dates reels by it
  get c/rendered-at.json "$W/old.json" || echo '{}' > "$W/old.json"
  node -e '
    const fs = require("fs"), [o, s, out] = process.argv.slice(1), m = JSON.parse(fs.readFileSync(o, "utf8") || "{}"), at = {};
    const rows = fs.readFileSync(s, "utf8").split("\n").filter(Boolean).map((l) => l.split("\t"));
    for (const end of ["-cover.jpg", ".mp4"]) for (const [name, t] of rows) if (/^showreel-[a-z0-9-]+$/.test(name.slice(0, -end.length)) && name.endsWith(end)) at[name.slice(0, -end.length)] = t;   // the MP4 time wins
    fs.writeFileSync(out, JSON.stringify(Object.assign(m, at)));' "$W/old.json" "$W/stamps.tsv" "$W/rendered-at.json"
  put "$W/rendered-at.json" c/rendered-at.json
  echo "MIGRATED total: $okall of $total assets"
  [ "$okall" = "$total" ]
}

RUNNER_TMP_ERR=$(mktemp)
cmd=${1:-}; shift || true
case "$cmd" in
  ensure) ensure;;
  check) check;;
  put) put "$@";;
  get) get "$@";;
  migrate) migrate "$@";;
  *) sed -n '2,16p' "$0"; exit 2;;
esac
