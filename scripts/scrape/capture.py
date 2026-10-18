import sys, io, json, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
from playwright.sync_api import sync_playwright
out = sys.argv[1]
URL = "https://skyproaviation.org/"
results = {}
def run(p, name, vp, mobile):
    b = p.chromium.launch(headless=True)
    ctx = b.new_context(viewport=vp, is_mobile=mobile, has_touch=mobile,
        user_agent=("Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36" if mobile else
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"))
    page = ctx.new_page()
    reqs = {}
    def on_resp(r):
        rt = r.request.resource_type
        ct = r.headers.get("content-type", "")
        if rt in ("image", "media") or ct.startswith(("image/", "video/")):
            reqs[r.url] = {"type": rt, "ct": ct, "status": r.status, "len": r.headers.get("content-length")}
    page.on("response", on_resp)
    page.goto(URL, wait_until="domcontentloaded", timeout=90000)
    page.wait_for_timeout(3000)
    h = page.evaluate("document.body.scrollHeight")
    y = 0
    while y < h:
        y += 400
        page.mouse.wheel(0, 400)
        page.wait_for_timeout(250)
        h = page.evaluate("document.body.scrollHeight")
    page.wait_for_timeout(3000)
    # click course tabs + faq to trigger any hidden media
    for sel in ['.e-n-tab-title', '.elementor-tab-title', '.jkit-accordion .card-header']:
        for el in page.query_selector_all(sel):
            try: el.click(timeout=1000); page.wait_for_timeout(200)
            except Exception: pass
    page.wait_for_timeout(1500)
    page.evaluate("window.scrollTo(0,0)")
    page.wait_for_timeout(500)
    page.screenshot(path=f"{out}/live-{name}.png", full_page=True)
    hero = page.evaluate("(() => { const v=document.getElementById('introVideo'); return v ? {src: v.currentSrc, w: v.videoWidth, h: v.videoHeight, dur: v.duration} : null })()")
    results[name] = {"hero": hero, "requests": reqs}
    b.close()
with sync_playwright() as p:
    run(p, "desktop", {"width": 1440, "height": 900}, False)
    run(p, "mobile", {"width": 375, "height": 812}, True)
json.dump(results, open(f"{out}/network.json", "w", encoding="utf-8"), indent=1)
for k, v in results.items():
    print(k, "hero:", v["hero"], "| media requests:", len(v["requests"]))
