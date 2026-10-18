import sys, re, json, io, html as H
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
from bs4 import BeautifulSoup
raw = open(sys.argv[1], encoding='utf-8').read()
soup = BeautifulSoup(raw, 'lxml')
print("TITLE:", soup.title.get_text(strip=True) if soup.title else None)
for m in soup.find_all('meta'):
    if m.get('name') in ('description','robots') or (m.get('property') or '').startswith('og:'):
        print("META", m.get('name') or m.get('property'), "=", m.get('content'))
for l in soup.find_all('link', rel=['canonical','icon','apple-touch-icon']):
    print("LINK", l.get('rel'), l.get('href'))
print("\n### HEADINGS")
for h in soup.find_all(re.compile('^h[1-6]$')):
    print(h.name, '|', h.get_text(' ', strip=True)[:140])
print("\n### HEADER/FOOTER TEMPLATES")
for t in soup.select('[data-elementor-type="header"], [data-elementor-type="footer"], header, footer'):
    print("----", t.name, t.get('data-elementor-type'), t.get('class'))
    print(t.get_text("\n", strip=True)[:3000])
    for a in t.find_all('a'):
        print("   A:", a.get_text(' ', strip=True)[:60], '->', a.get('href'))
    for img in t.find_all('img'):
        print("   IMG:", img.get('src'), img.get('alt'))
print("\n### VIDEOS")
for v in soup.find_all(['video','source','iframe']):
    print(v.name, {k: v.get(k) for k in ('src','poster','data-src','autoplay','muted','loop')})
print("\n### DATA-SETTINGS")
for el in soup.select('[data-settings]'):
    try: d = json.loads(el['data-settings'])
    except Exception: continue
    keys = {k: v for k, v in d.items() if any(s in k for s in ('background_image','background_video','background_slideshow','youtube','video','image','link'))}
    if keys: print(el.get('data-id'), el.get('data-widget_type') or el.get('data-element_type'), json.dumps(keys)[:600])
print("\n### INLINE BG IMAGES")
for el in soup.select('[style*="url("]'):
    print(el.get('data-id'), re.findall(r'url\(([^)]+)\)', el['style']))
print("\n### IMAGES IN ORDER")
for img in soup.find_all('img'):
    print(img.get('src') or img.get('data-src'), '| alt=', img.get('alt'), '| w=', img.get('width'), 'h=', img.get('height'))
print("\n### YOUTUBE / LINKS")
ids = set(re.findall(r'(?:youtube\.com/(?:embed/|watch\?v=|shorts/)|youtu\.be/)([A-Za-z0-9_-]{11})', raw))
print("YT IDS:", sorted(ids))
for a in soup.find_all('a'):
    href = a.get('href') or ''
    print("A:", repr(a.get_text(' ', strip=True)[:60]), '->', href)
