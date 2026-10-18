import sys, json, os, urllib.request, concurrent.futures as cf

man = json.load(open(sys.argv[1], encoding="utf-8"))
out = sys.argv[2]
os.makedirs(out, exist_ok=True)


def get(item):
    src, name = item[0], item[1]
    ext = os.path.splitext(src)[1]
    dst = os.path.join(out, name.replace("/", "__") + ext)
    if os.path.exists(dst) and os.path.getsize(dst) > 0:
        return (src, dst, "cached", os.path.getsize(dst), "")
    req = urllib.request.Request(man["base"] + src, headers={"User-Agent": "Mozilla/5.0", "Accept": "*/*"})
    try:
        with urllib.request.urlopen(req, timeout=300) as r, open(dst, "wb") as f:
            ct = r.headers.get("content-type", "")
            while True:
                b = r.read(1 << 20)
                if not b:
                    break
                f.write(b)
        return (src, dst, "ok", os.path.getsize(dst), ct)
    except Exception as e:
        return (src, dst, "ERR " + str(e), 0, "")


with cf.ThreadPoolExecutor(6) as ex:
    for src, dst, st, size, ct in ex.map(get, man["items"]):
        print(f"{st:6} {size:>10} {ct:14} {os.path.basename(dst)}")
