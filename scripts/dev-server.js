import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Servidor HTTP estático en Node.js estándar para desarrollo local sin dependencias externas.
 */
export class StaticDevServer {
  static MIME_TYPES = Object.freeze({
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.ico': 'image/x-icon'
  });

  /**
   * @param {object} [options]
   * @param {string} [options.rootDir]
   * @param {number} [options.port]
   */
  constructor({ rootDir, port } = {}) {
    const scriptDir = path.dirname(fileURLToPath(import.meta.url));
    this.rootDir = rootDir || path.resolve(scriptDir, '..');
    this.port = Number(port || process.env.FRONTEND_PORT || 5500);
    this.server = http.createServer((req, res) => this.#handleRequest(req, res));
  }

  /**
   * @param {import('node:http').IncomingMessage} req
   * @param {import('node:http').ServerResponse} res
   */
  async #handleRequest(req, res) {
    try {
      const reqUrl = new URL(req.url || '/', `http://127.0.0.1:${this.port}`);
      const safePath = path.normalize(reqUrl.pathname).replace(/^(\.\.[/\\])+/, '');
      const relative = safePath === '/' || safePath === '\\' ? 'index.html' : safePath.replace(/^[/\\]+/, '');
      const fullPath = path.resolve(this.rootDir, relative);

      if (!fullPath.startsWith(this.rootDir)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Forbidden');
        return;
      }

      const content = await readFile(fullPath);
      const ext = path.extname(fullPath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': StaticDevServer.MIME_TYPES[ext] || 'application/octet-stream',
        'Cache-Control': 'no-store'
      });
      res.end(content);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
    }
  }

  /**
   * @returns {Promise<{ port: number, url: string }>}
   */
  start() {
    return new Promise((resolve) => {
      this.server.listen(this.port, '127.0.0.1', () => {
        const address = this.server.address();
        const boundPort = typeof address === 'object' && address ? address.port : this.port;
        const url = `http://localhost:${boundPort}`;
        console.log(`[lueurfle-frontend] Serving static UI at ${url}`);
        resolve({ port: boundPort, url });
      });
    });
  }

  /**
   * @returns {Promise<void>}
   */
  stop() {
    return new Promise((resolve, reject) => {
      this.server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}

const isExecutedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isExecutedDirectly) {
  const server = new StaticDevServer();
  await server.start();
}
