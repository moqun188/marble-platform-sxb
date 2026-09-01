import express from "express";
import http from "http";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 5174;
const BACKEND = "http://127.0.0.1:3200";

// Proxy /api requests to backend
app.use("/api", (req, res) => {
  const url = BACKEND + req.originalUrl;
  const proxyReq = http.request(url, {
    method: req.method,
    headers: { ...req.headers, host: "127.0.0.1:3200" },
  }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  proxyReq.on("error", (e) => {
    console.error("Proxy error:", e.message);
    res.status(502).json({ error: "Backend unavailable" });
  });
  req.pipe(proxyReq);
});

// Serve static files with cache for assets, no-cache for HTML
const staticDir = join(__dirname, "../../frontend-static");
app.use(express.static(staticDir, {
  setHeaders: (res, path) => {
    if (path.endsWith(".html")) {
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    }
  }
}));

// SPA fallback - always no-cache
app.get("*", (req, res) => {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.sendFile(join(staticDir, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Frontend running on port " + PORT);
});
