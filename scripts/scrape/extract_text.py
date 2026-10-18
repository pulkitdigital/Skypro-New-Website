import sys, re, json
import io; sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
from bs4 import BeautifulSoup, NavigableString
html = open(sys.argv[1], encoding='utf-8').read()
soup = BeautifulSoup(html, 'lxml')
for t in soup(['script','style','noscript','svg']): t.decompose()
body = soup.body
# Walk elementor top-level containers/sections in order
tops = body.select('[data-elementor-type="wp-page"] > .e-con, [data-elementor-type="wp-page"] > section, [data-elementor-type="wp-page"] > div')
print("TOP CONTAINERS:", len(tops))
for i, el in enumerate(tops):
    txt = el.get_text("\n", strip=True)
    print(f"\n======== [{i}] id={el.get('data-id')} class={' '.join(el.get('class',[]))[:80]} ========")
    print(txt[:6000])
