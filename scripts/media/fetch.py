# Free real media for a reel (owner, 14 Nov 2026: "yes to free real images ... take those and work or animate your design around it").
# Runs on GitHub (the "Media" workflow), never in a session. For each entry of the config's "media" list it searches keyless APIs, keeps
# only allowed licences (public domain, CC0, CC BY; never NC, ND, SA, "editorial", or a trademark restriction), downloads the best image,
# resizes it, cuts a foreground layer when asked (rembg, then OpenCV GrabCut as the fallback), and writes a manifest plus a contact sheet.
#
# Config entry (a reel config's "media": [...]):
#   {"id": "falls-now", "queries": ["American Falls Niagara"], "sources": ["wikimedia", "openverse", "nasa", "loc"],
#    "url": "<a direct Commons File: page or file URL instead of searching>", "pick": 0 (the n-th ranked candidate), "cut": false,
#    "min_side": 900, "avoid": ["logo", "apple"] (words that drop a candidate by its title/tags), "crop": [x0, y0, x1, y1] (fractions)}
# After the run the session copies the MEDIA_JSON line back into the config: each entry gains file, fg, w, h, title, author, licence,
# licence_url, source_url, source. Output QA LICENCE reads those fields.
#
# Usage: python3 scripts/media/fetch.py <config.json> <out dir>
import io, json, os, re, sys, time, urllib.parse, urllib.request
from html import unescape

from PIL import Image, ImageDraw, ImageFont, ImageOps

UA = 'reel-media-fetch/1.0 (GitHub Actions; free-licence images for short videos)'
ALLOWED = ('cc0', 'pd', 'pdm', 'cc-by')
LONG = 2400        # the processed image's long side (px): a 1080x1920 frame with room for a slow push-in
FG_LONG = 1600


def get(url, raw=False, tries=3):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': '*/*' if raw else 'application/json'})
            with urllib.request.urlopen(req, timeout=60) as r:
                b = r.read()
            return b if raw else json.loads(b.decode('utf-8'))
        except Exception as e:   # noqa: BLE001 (any network error: retry, then give up on this source)
            err = e
            time.sleep(2 + 4 * i)
    print(f'  fetch failed: {url[:120]} ({err})')
    return None


def strip(h):
    return re.sub(r'\s+', ' ', unescape(re.sub(r'<[^>]+>', ' ', h or ''))).strip()


def norm_licence(s):
    """A licence name or code -> 'cc0' | 'pd' | 'pdm' | 'cc-by-<v>' | None (not allowed)."""
    s = (s or '').strip().lower().replace('_', '-').replace(' ', '-')
    if not s:
        return None
    tok = set(re.split(r'[-/]', s))
    if tok & {'nc', 'nd', 'sa', 'noncommercial', 'sharealike', 'editorial', 'copyrighted', 'fair', 'gfdl'} or 'no-deriv' in s:
        return None
    if s.startswith('cc0') or s == 'cc-zero' or 'cc0' in s:
        return 'cc0'
    if s in ('pdm', 'public-domain-mark', 'pdm-1.0'):
        return 'pdm'
    if s.startswith('pd') or 'public-domain' in s or s == 'public-domain':
        return 'pd'
    m = re.match(r'^cc-?by(?:-(\d(?:\.\d)?))?$', s)
    if m:
        return 'cc-by' + ('-' + m.group(1) if m.group(1) else '')
    return None


# ---------- sources: each returns candidates {title, w, h, url (download), thumb, source_url, author, licence, licence_url, source, tags} ----------
def wikimedia(q, n=20, title=None):
    p = {'action': 'query', 'format': 'json', 'prop': 'imageinfo', 'iiprop': 'url|size|mime|extmetadata', 'iiurlwidth': str(LONG)}
    if title:
        p['titles'] = title
    else:
        p.update({'generator': 'search', 'gsrnamespace': '6', 'gsrsearch': q + ' filetype:bitmap', 'gsrlimit': str(n)})
    d = get('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(p))
    out = []
    for pg in ((d or {}).get('query', {}).get('pages', {}) or {}).values():
        ii = (pg.get('imageinfo') or [{}])[0]
        if not ii.get('url') or not str(ii.get('mime', '')).startswith('image/') or ii.get('mime') == 'image/svg+xml':
            continue
        em = ii.get('extmetadata', {})
        ev = lambda k: strip((em.get(k) or {}).get('value', ''))   # noqa: E731
        lic = norm_licence(ev('License')) or norm_licence(ev('LicenseShortName'))
        restr = ev('Restrictions').lower()
        out.append({'title': pg.get('title', '').replace('File:', ''), 'w': ii.get('width', 0), 'h': ii.get('height', 0),
                    'url': ii.get('thumburl') or ii['url'], 'thumb': ii.get('thumburl') or ii['url'], 'source_url': ii.get('descriptionurl'),
                    'author': ev('Artist') or ev('Credit') or 'unknown', 'licence': lic, 'licence_name': ev('LicenseShortName'),
                    'licence_url': ev('LicenseUrl'), 'source': 'wikimedia', 'tags': (ev('ImageDescription') + ' ' + ev('Categories')).lower(),
                    'restrict': restr, 'date': ev('DateTimeOriginal')})
    return out


def openverse(q, n=20):
    p = {'q': q, 'license': 'cc0,pdm,by', 'page_size': str(n), 'mature': 'false'}
    d = get('https://api.openverse.org/v1/images/?' + urllib.parse.urlencode(p))
    out = []
    for r in (d or {}).get('results', []):
        lic = norm_licence(r.get('license', '') + ('-' + r['license_version'] if r.get('license') == 'by' and r.get('license_version') else ''))
        if r.get('license') == 'by':
            lic = 'cc-by-' + r.get('license_version', '') if r.get('license_version') else 'cc-by'
        out.append({'title': r.get('title') or '', 'w': r.get('width') or 0, 'h': r.get('height') or 0, 'url': r.get('url'),
                    'thumb': r.get('thumbnail') or r.get('url'), 'source_url': r.get('foreign_landing_url'), 'author': r.get('creator') or 'unknown',
                    'licence': lic, 'licence_name': f"{r.get('license', '')} {r.get('license_version', '')}".strip(), 'licence_url': r.get('license_url'),
                    'source': 'openverse:' + str(r.get('source') or r.get('provider')), 'tags': ' '.join(t.get('name', '') for t in r.get('tags') or []).lower(),
                    'restrict': ''})
    return out


def nasa(q, n=15):
    d = get('https://images-api.nasa.gov/search?' + urllib.parse.urlencode({'q': q, 'media_type': 'image'}))
    out = []
    for it in ((d or {}).get('collection', {}).get('items') or [])[:n]:
        dd = (it.get('data') or [{}])[0]
        nid = dd.get('nasa_id')
        if not nid:
            continue
        thumb = next((l['href'] for l in it.get('links') or [] if l.get('rel') == 'preview'), None)
        out.append({'title': dd.get('title', ''), 'w': 0, 'h': 0, 'url': f'nasa:{nid}', 'thumb': thumb,
                    'source_url': f'https://images.nasa.gov/details/{urllib.parse.quote(nid)}', 'author': dd.get('photographer') or dd.get('center') or 'NASA',
                    'licence': 'pd', 'licence_name': 'Public domain (NASA)', 'licence_url': 'https://www.nasa.gov/nasa-brand-center/images-and-media/',
                    'source': 'nasa', 'tags': ' '.join(dd.get('keywords') or []).lower(), 'restrict': ''})
    return out


def loc(q, n=15):
    d = get('https://www.loc.gov/photos/?' + urllib.parse.urlencode({'q': q, 'fo': 'json', 'c': str(n)}))
    out = []
    for r in (d or {}).get('results', []):
        rights = ' '.join(r.get('rights_advisory') or [] if isinstance(r.get('rights_advisory'), list) else [str(r.get('rights_advisory') or '')]).lower()
        imgs = r.get('image_url') or []
        if 'no known restrictions' not in rights or not imgs:
            continue
        out.append({'title': r.get('title', ''), 'w': 0, 'h': 0, 'url': imgs[-1].split('#')[0], 'thumb': imgs[0].split('#')[0],
                    'source_url': r.get('url') or r.get('id'), 'author': ', '.join(r.get('contributor') or []) or 'Library of Congress',
                    'licence': 'pd', 'licence_name': 'No known restrictions (Library of Congress)', 'licence_url': 'https://www.loc.gov/legal/',
                    'source': 'loc', 'tags': ' '.join(r.get('subject') or []).lower(), 'restrict': ''})
    return out


SOURCES = {'wikimedia': wikimedia, 'openverse': openverse, 'nasa': nasa, 'loc': loc}


def resolve_url(u):
    """A direct link: a Commons File: page, an upload.wikimedia.org file, or an Openverse image page."""
    m = re.search(r'commons\.wikimedia\.org/wiki/(File:[^?#]+)', u)
    if m:
        return wikimedia('', title=urllib.parse.unquote(m.group(1)))
    m = re.search(r'upload\.wikimedia\.org/.+/([^/]+\.(?:jpe?g|png|tiff?|webp))$', u, re.I)
    if m:
        return wikimedia('', title='File:' + urllib.parse.unquote(m.group(1)))
    m = re.search(r'openverse\.org/image/([0-9a-f-]{36})', u)
    if m:
        r = get(f'https://api.openverse.org/v1/images/{m.group(1)}/')
        if r:
            return [c for c in openverse_one(r)]
    print(f'  unsupported direct url (use a Commons File: page or an Openverse image): {u}')
    return []


def openverse_one(r):
    lic = 'cc-by-' + r.get('license_version', '') if r.get('license') == 'by' else norm_licence(r.get('license'))
    yield {'title': r.get('title') or '', 'w': r.get('width') or 0, 'h': r.get('height') or 0, 'url': r.get('url'), 'thumb': r.get('thumbnail') or r.get('url'),
           'source_url': r.get('foreign_landing_url'), 'author': r.get('creator') or 'unknown', 'licence': lic, 'licence_name': r.get('license'),
           'licence_url': r.get('license_url'), 'source': 'openverse:' + str(r.get('source')), 'tags': '', 'restrict': ''}


def score(c, words, e):
    if not c['licence'] or 'trademark' in c.get('restrict', ''):
        return -1
    text = (c['title'] + ' ' + c.get('tags', '')).lower()
    if any(a.lower() in text for a in e.get('avoid', [])) or any(b in text for b in ('watermark', 'logo', 'shutterstock', 'getty', 'alamy', 'stock photo')):
        return -1
    side = min(c['w'], c['h']) if c['w'] and c['h'] else 1200
    if side and side < e.get('min_side', 700):
        return -1
    hit = sum(1 for w in words if w in text) / max(1, len(words))
    return hit * 3 + min(side, 3000) / 1500 + (.3 if c['licence'] in ('cc0', 'pd', 'pdm') else 0)


def download(c):
    u = c['url']
    if u.startswith('nasa:'):
        m = get('https://images-api.nasa.gov/asset/' + urllib.parse.quote(u[5:]))
        hrefs = [i['href'] for i in (m or {}).get('collection', {}).get('items', [])]
        u = next((h for h in hrefs if '~large.jpg' in h), None) or next((h for h in hrefs if '~orig.jpg' in h), None) or (hrefs[0] if hrefs else None)
        if not u:
            return None
        c['url'] = u.replace('http://', 'https://')
        u = c['url']
    b = get(u, raw=True)
    if not b:
        return None
    try:
        im = Image.open(io.BytesIO(b))
        im = ImageOps.exif_transpose(im).convert('RGB')
        return im
    except Exception as ex:   # noqa: BLE001
        print(f'  not an image: {u[:100]} ({ex})')
        return None


def cutout(im):
    """The foreground as RGBA (rembg's u2net; OpenCV GrabCut round the middle as the fallback)."""
    try:
        from rembg import remove
        fg = remove(im)
        if fg.getchannel('A').getextrema()[1] > 0:
            return fg, 'rembg'
    except Exception as ex:   # noqa: BLE001
        print(f'  rembg unavailable ({ex}); GrabCut')
    import numpy as np
    import cv2
    a = np.array(im)[:, :, ::-1].copy()
    h, w = a.shape[:2]
    mask = np.zeros((h, w), np.uint8)
    rect = (int(w * .08), int(h * .08), int(w * .84), int(h * .84))
    bg, fgm = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(a, mask, rect, bg, fgm, 5, cv2.GC_INIT_WITH_RECT)
    m = np.where((mask == 1) | (mask == 3), 255, 0).astype(np.uint8)
    out = im.convert('RGBA')
    out.putalpha(Image.fromarray(m).filter(__import__('PIL.ImageFilter', fromlist=['x']).GaussianBlur(2)))
    return out, 'grabcut'


def fit(im, long):
    s = long / max(im.size)
    return im.resize((round(im.size[0] * s), round(im.size[1] * s)), Image.LANCZOS) if s < 1 else im


def font(sz):
    try:
        return ImageFont.load_default(size=sz)
    except TypeError:
        return ImageFont.load_default()


def main():
    cfgp, out = sys.argv[1], sys.argv[2]
    cfg = json.load(open(cfgp))
    name = cfg.get('name') or ('showreel-tech-' + cfg['slug'])
    os.makedirs(out, exist_ok=True)
    entries, rows = [], []
    for e in cfg.get('media', []):
        print(f'MEDIA {e["id"]}: searching')
        cands = []
        if e.get('url'):
            cands = resolve_url(e['url'])
        else:
            for q in e.get('queries') or [e.get('query', '')]:
                for s in e.get('sources') or ['wikimedia', 'openverse', 'loc', 'nasa']:
                    try:
                        cands += SOURCES[s](q)
                    except Exception as ex:   # noqa: BLE001
                        print(f'  {s} failed for "{q}": {ex}')
        seen, uniq = set(), []
        for c in cands:
            k = c.get('source_url') or c['url']
            if k not in seen:
                seen.add(k)
                uniq.append(c)
        words = [w for w in re.findall(r'[a-z0-9]+', ' '.join(e.get('queries') or [e.get('query', '')]).lower()) if len(w) > 2]
        ranked = sorted((c for c in uniq if score(c, words, e) >= 0), key=lambda c: -score(c, words, e))
        rejected = [c for c in uniq if score(c, words, e) < 0]
        print(f'  {len(uniq)} found, {len(ranked)} allowed, {len(rejected)} rejected (licence, restriction, size or avoid words)')
        for i, c in enumerate(ranked[:8]):
            print(f'  [{i}] {c["licence"]:<9} {c["w"]}x{c["h"]} {c["source"]} | {c["title"][:70]} | {c["source_url"]}')
        pick, im, ch = int(e.get('pick', 0)), None, None
        for c in ranked[pick:pick + 6]:   # the picked one, or the next that downloads
            im = download(c)
            if im is not None:
                ch = c
                break
        thumbs = []
        for i, c in enumerate(ranked[:6]):
            tb = get(c['thumb'], raw=True) if c.get('thumb') and not c['thumb'].startswith('nasa:') else None
            try:
                t = Image.open(io.BytesIO(tb)).convert('RGB') if tb else None
            except Exception:   # noqa: BLE001
                t = None
            thumbs.append((i, c, t))
        rows.append((e, ch, im, thumbs))
        if im is None:
            print(f'MEDIA {e["id"]}: NONE (no allowed image downloaded; change the queries or give a "url")')
            entries.append({'id': e['id'], 'file': None})
            continue
        if e.get('crop'):
            x0, y0, x1, y1 = e['crop']
            W0, H0 = im.size
            im = im.crop((round(x0 * W0), round(y0 * H0), round(x1 * W0), round(y1 * H0)))
        im = fit(im, LONG)
        fn = f'{e["id"]}.jpg'
        im.save(os.path.join(out, fn), quality=90, optimize=True)
        ent = {'id': e['id'], 'file': fn, 'w': im.size[0], 'h': im.size[1], 'title': ch['title'][:160], 'author': ch['author'][:160],
               'licence': ch['licence'], 'licence_name': ch.get('licence_name', ''), 'licence_url': ch.get('licence_url') or '',
               'source_url': ch['source_url'], 'file_url': ch['url'], 'source': ch['source']}
        if e.get('cut'):
            fg, how = cutout(fit(im, FG_LONG))
            fg.save(os.path.join(out, f'{e["id"]}-fg.png'), optimize=True)
            ent['fg'] = f'{e["id"]}-fg.png'
            ent['cut'] = how
        entries.append(ent)
        print(f'MEDIA {e["id"]}: {fn} {im.size[0]}x{im.size[1]} | {ch["licence"]} | {ch["author"][:60]} | {ch["source_url"]}')
    json.dump({'name': name, 'media': entries}, open(os.path.join(out, 'manifest.json'), 'w'), indent=1, ensure_ascii=False)
    # the contact sheet: per entry, the chosen image large (and its cut-out) and the next candidates with their index and licence
    rh, W = 420, 2200
    sheet = Image.new('RGB', (W, 60 + rh * len(rows) + 10), (24, 24, 28))
    d = ImageDraw.Draw(sheet)
    d.text((20, 15), f'{name}: media (chosen on the left; [n] = "pick": n)', fill=(240, 240, 240), font=font(28))
    for r, (e, ch, im, thumbs) in enumerate(rows):
        y = 60 + r * rh
        x = 20
        d.text((x, y), f'{e["id"]}: ' + (f'{ch["licence"]} | {ch["author"][:40]} | {ch["source"]}' if ch else 'NONE'), fill=(255, 210, 120), font=font(20))
        if im is not None:
            t = im.copy()
            t.thumbnail((640, rh - 50))
            sheet.paste(t, (x, y + 30))
            x += t.size[0] + 20
            fgp = os.path.join(out, f'{e["id"]}-fg.png')
            if os.path.exists(fgp):
                f = Image.open(fgp)
                f.thumbnail((360, rh - 50))
                chk = Image.new('RGB', f.size, (90, 160, 90))
                chk.paste(f, (0, 0), f)
                sheet.paste(chk, (x, y + 30))
                x += f.size[0] + 20
        for i, c, t in thumbs:
            if t is None or x > W - 200:
                continue
            t.thumbnail((260, rh - 90))
            sheet.paste(t, (x, y + 30))
            d.text((x, y + 34 + t.size[1]), f'[{i}] {c["licence"]} {c["w"]}x{c["h"]}', fill=(220, 220, 220), font=font(16))
            d.text((x, y + 54 + t.size[1]), c['title'][:34], fill=(170, 170, 170), font=font(14))
            x += t.size[0] + 14
    sheet.save(os.path.join(out, 'contact.png'))
    print('MEDIA_JSON ' + json.dumps(entries, ensure_ascii=False, separators=(',', ':')))
    bad = [x['id'] for x in entries if not x.get('file')]
    print('MEDIA: ' + (f'MISSING {", ".join(bad)}' if bad else f'all {len(entries)} found'))


if __name__ == '__main__':
    main()
