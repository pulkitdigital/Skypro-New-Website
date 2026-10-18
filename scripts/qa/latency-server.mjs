// Static server with artificial per-request latency, to approximate a real network when
// running Lighthouse locally (on bare localhost, async scripts run before the first frame,
// which never happens in production).
// Usage: node scripts/qa/latency-server.mjs [dir=out] [port=4174] [latencyMs=100]
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const root = path.resolve(process.argv[2] || "out");
const port = Number(process.argv[3] || 4174);
const latency = Number(process.argv[4] || 100);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

http
  .createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    let file = path.join(root, p);
    if (!file.startsWith(root)) return res.writeHead(403).end();
    if (!fs.existsSync(file) && fs.existsSync(`${file}.html`)) file = `${file}.html`;
    setTimeout(() => {
      if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end("not found");
      const ext = path.extname(file);
      const headers = { "Content-Type": types[ext] || "application/octet-stream", "Cache-Control": "no-cache" };
      const compressible = /\.(html|js|css|json|svg|txt|xml)$/.test(ext) && /br|gzip/.test(req.headers["accept-encoding"] || "");
      if (compressible) {
        res.writeHead(200, { ...headers, "Content-Encoding": "gzip" });
        fs.createReadStream(file).pipe(zlib.createGzip()).pipe(res);
      } else {
        res.writeHead(200, headers);
        fs.createReadStream(file).pipe(res);
      }
    }, latency);
  })
  .listen(port, () => console.log(`serving ${root} on :${port} with ${latency}ms latency`));
