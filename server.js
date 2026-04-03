const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIST = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

function getMime(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function serveFile(res, filePath, statusCode = 200) {
  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(statusCode, {
      'Content-Type': getMime(filePath),
      'Content-Length': data.length,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    });
    res.end(data);
  } catch {
    serve404(res);
  }
}

function serve404(res) {
  const page404 = path.join(DIST, '404.html');
  try {
    const data = fs.readFileSync(page404);
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
}

const server = http.createServer((req, res) => {
  // Parse raw URL manually to handle malformed paths like ///
  const rawUrl = req.url || '/';
  const qIndex = rawUrl.indexOf('?');
  const pathname = qIndex >= 0 ? rawUrl.slice(0, qIndex) : rawUrl;
  const search = qIndex >= 0 ? rawUrl.slice(qIndex) : '';

  // 1. Normalize multiple consecutive slashes → single slash
  const cleaned = pathname.replace(/\/{2,}/g, '/');

  // 2. Remove trailing slash (except root)
  const normalized = cleaned.length > 1 ? cleaned.replace(/\/$/, '') : cleaned;

  // 3. Redirect /index.html → /
  const final = normalized === '/index.html' ? '/' : normalized;

  // If URL was changed, send 301 redirect
  if (final !== pathname) {
    const location = final + search;
    res.writeHead(301, { 'Location': location });
    res.end();
    return;
  }

  // Resolve file path
  let filePath;
  if (pathname === '/') {
    filePath = path.join(DIST, 'index.html');
  } else {
    filePath = path.join(DIST, pathname);
    // If path has no extension, try .html or /index.html
    if (!path.extname(filePath)) {
      if (fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
      } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
        filePath = path.join(filePath, 'index.html');
      }
    }
  }

  // Security: prevent path traversal
  if (!filePath.startsWith(DIST)) {
    serve404(res);
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    serveFile(res, filePath);
  } else {
    serve404(res);
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
