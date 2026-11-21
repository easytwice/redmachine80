import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('out');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.avif': 'image/avif', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    const requested = path.resolve(root, `.${pathname}`, pathname.endsWith('/') ? 'index.html' : '');
    if (!requested.startsWith(`${root}${path.sep}`)) { response.writeHead(403).end(); return; }
    const file = (await stat(requested)).isDirectory() ? path.join(requested, 'index.html') : requested;
    const body = await readFile(file);
    response.writeHead(200, { 'content-type': `${types[path.extname(file)] ?? 'application/octet-stream'}; charset=utf-8` }).end(body);
  } catch { response.writeHead(404).end('Not found'); }
}).listen(Number(process.env.PORT ?? 3000), '127.0.0.1', () => console.log('Preview: http://127.0.0.1:' + (process.env.PORT ?? 3000)));
