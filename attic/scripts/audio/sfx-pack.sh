#!/usr/bin/env bash
# Licensed sound pack for the films (owner, 15 Oct 2026: more sound variety). CC0 (public domain) packs by Kenney (kenney.nl), downloaded on GitHub at render time
# into $SFX_DIR, never committed. Writes $SFX_DIR/index.json mapping our cue kinds to files. Any failure leaves no index and sfx.mjs falls back to its own effects.
set -u
SFX_DIR="${SFX_DIR:-$HOME/.cache/aquarii-sfx}"; mkdir -p "$SFX_DIR"
if [ ! -f "$SFX_DIR/.done" ]; then
  for pack in interface-sounds sci-fi-sounds impact-sounds; do
    page=$(curl -sSL -m 30 "https://kenney.nl/assets/$pack" || true)
    url=$(printf '%s' "$page" | grep -oE "(https://kenney\.nl)?/media/pages/assets/$pack/[^\"' ]+\.zip" | head -1)
    [ -z "$url" ] && { echo "sfx-pack: no zip link for $pack"; continue; }
    case "$url" in /*) url="https://kenney.nl$url";; esac
    curl -sSL -m 120 -o "$SFX_DIR/$pack.zip" "$url" && unzip -qo "$SFX_DIR/$pack.zip" -d "$SFX_DIR/$pack" && echo "sfx-pack: $pack ok" && touch "$SFX_DIR/.done"
  done
fi
node -e '
const fs=require("fs"),path=require("path"),dir=process.argv[1];const files=[];
(function walk(d){for(const f of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,f.name);if(f.isDirectory())walk(p);else if(/\.(ogg|wav|mp3)$/i.test(f.name))files.push(p);}})(dir);
const pick=(re)=>files.filter((f)=>re.test(path.basename(f))).sort();
const idx={click:pick(/^(select|click|toggle|switch)_/i),tick:pick(/^tick_/i),whoosh:pick(/^(maximize|minimize|scroll|forceField)_/i),
  impact:pick(/^(drop|impactSoft|impactGlass|impactMetal_light|glass)_/i),riser:pick(/^(forceField|computerNoise|phaserUp|spaceEngineLow)_/i),sparkle:pick(/^(confirmation|glass|pluck)_/i)};
for(const k in idx) if(!idx[k].length) delete idx[k];
if(Object.keys(idx).length){fs.writeFileSync(path.join(dir,"index.json"),JSON.stringify(idx,null,1));console.log("sfx-pack:",Object.entries(idx).map(([k,v])=>k+" "+v.length).join(", "));}
else console.log("sfx-pack: no usable files; films use their own effects");
' "$SFX_DIR"
