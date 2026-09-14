import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const pub = join(dirname(fileURLToPath(import.meta.url)), 'public');
let todos = [];
const json = (res, code, body) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)); };
createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/todos' && req.method === 'GET') return json(res, 200, todos);
  if (url.pathname === '/api/todos' && req.method === 'POST') {
    let body = ''; for await (const c of req) body += c;
    const { title } = JSON.parse(body);
    if (!title?.trim()) return json(res, 400, { error: 'Title is required' });
    const t = { id: Date.now(), title: title.trim(), done: false }; todos.push(t); return json(res, 201, t);
  }
  const m = url.pathname.match(/^\/api\/todos\/(\d+)$/);
  if (m && req.method === 'PATCH') { const t = todos.find((x) => x.id === +m[1]); if (t) t.done = !t.done; return json(res, 200, t); }
  if (m && req.method === 'DELETE') { todos = todos.filter((x) => x.id !== +m[1]); return json(res, 204, {}); }
  if (url.pathname === '/api/metrics') { console.error('metrics backend down'); return json(res, 500, { error: 'metrics unavailable' }); }
  if (url.pathname === '/api/reset') { todos = []; return json(res, 200, {}); }
  try { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(await readFile(join(pub, 'index.html'))); }
  catch { res.writeHead(404); res.end('not found'); }
}).listen(process.env.PORT ?? 4321, () => console.log('todo app on http://localhost:4321'));
