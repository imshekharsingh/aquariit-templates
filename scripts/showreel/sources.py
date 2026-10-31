# Sources (owner, 31 Oct 2026: every formula behaviour checked against the official documentation): fetches every "sources" URL of
# the given reel configs and prints the page as plain text, so a session whose network blocks those hosts (support.microsoft.com,
# support.google.com) can still read the primary source in the run log before the reel is rendered.
# Usage: python3 scripts/showreel/sources.py <config.json>... [--chars N]
import html.parser, json, re, sys, urllib.request


class Text(html.parser.HTMLParser):
    SKIP = {'script', 'style', 'noscript', 'svg', 'nav', 'header', 'footer'}

    def __init__(self):
        super().__init__(); self.out, self.skip = [], 0

    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP: self.skip += 1
        if tag in ('p', 'li', 'tr', 'h1', 'h2', 'h3', 'h4', 'br', 'td', 'pre'): self.out.append('\n')

    def handle_endtag(self, tag):
        if tag in self.SKIP and self.skip: self.skip -= 1

    def handle_data(self, d):
        if not self.skip: self.out.append(d)


def main(args):
    n = 7000
    if '--chars' in args: i = args.index('--chars'); n = int(args[i + 1]); args = args[:i] + args[i + 2:]
    seen = set()
    for cfg in args:
        for s in json.load(open(cfg)).get('sources', []):
            u = s['url']
            if u in seen: continue
            seen.add(u)
            print(f'\n===== {u}\n(cited for: {s.get("note", "")})')
            try:
                req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) sources-check', 'Accept-Language': 'en-US,en'})
                raw = urllib.request.urlopen(req, timeout=30).read().decode('utf-8', 'replace')
            except Exception as e:
                print(f'FETCH FAILED: {e}'); continue
            p = Text(); p.feed(raw)
            txt = re.sub(r'[ \t\r\f\v]+', ' ', ''.join(p.out)); txt = re.sub(r'\n\s*\n+', '\n', txt).strip()
            print(txt[:n])


if __name__ == '__main__':
    main(sys.argv[1:])
