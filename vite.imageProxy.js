/**
 * Same-origin proxy for remote images (Vite dev/preview only; see `vite.config.js`).
 */
export function imageProxyMiddleware(req, res, next) {
  let pathname;
  try {
    pathname = new URL(req.url || "/", "http://internal").pathname;
  } catch {
    return next();
  }
  if (pathname !== "/__proxy-image") {
    return next();
  }

  (async () => {
    try {
      const url = new URL(req.url || "/", "http://internal");
      const target = url.searchParams.get("url");
      if (!target) {
        res.statusCode = 400;
        res.end();
        return;
      }
      let remote;
      try {
        remote = new URL(target);
      } catch {
        res.statusCode = 400;
        res.end();
        return;
      }
      if (remote.protocol !== "https:") {
        res.statusCode = 400;
        res.end();
        return;
      }
      if (!allowedImageHost(remote.hostname)) {
        res.statusCode = 403;
        res.end();
        return;
      }
      const r = await fetch(remote.toString(), {
        headers: { "User-Agent": "grocery-mweb-image-proxy/1" },
      });
      if (!r.ok) {
        res.statusCode = r.status;
        res.end();
        return;
      }
      const ct = r.headers.get("content-type");
      if (ct) res.setHeader("Content-Type", ct);
      res.setHeader("Cache-Control", "public, max-age=300");
      const buf = Buffer.from(await r.arrayBuffer());
      res.statusCode = 200;
      res.end(buf);
    } catch {
      res.statusCode = 502;
      res.end();
    }
  })();
}

/** @param {string} hostname */
function allowedImageHost(hostname) {
  return (
    hostname === "firebasestorage.googleapis.com" ||
    hostname === "storage.googleapis.com" ||
    hostname.endsWith(".googleusercontent.com") ||
    hostname === "lh3.googleusercontent.com" ||
    hostname === "gstatic.com" ||
    hostname.endsWith(".gstatic.com")
  );
}

export function imageProxyPlugin() {
  return {
    name: "grocery-image-proxy",
    configureServer(server) {
      server.middlewares.use(imageProxyMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(imageProxyMiddleware);
    },
  };
}
