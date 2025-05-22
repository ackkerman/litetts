import http from 'http';
import { providers, schemas } from './providers/index.js';

export function createApp(): any {
  return http.createServer((req: any, res: any) => {
    const url = new URL(req.url ?? '/', 'http://localhost');

    if (req.method === 'GET' && url.pathname === '/healthz') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }

    if (req.method === 'GET' && url.pathname === '/v1/schema') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(schemas, null, 2));
      return;
    }

    if (req.method === 'GET' && url.pathname === '/v1/providers') {
      const names = Object.keys(providers);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ providers: names }));
      return;
    }

    if (req.method === 'GET' && url.pathname === '/v1/voices') {
      const provider = providers[url.searchParams.get('provider') ?? ''];
      if (!provider) {
        res.statusCode = 400;
        res.end('unknown provider');
        return;
      }
      provider.voices().then((voices) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ voices }));
      });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/v1/status') {
      const result: Record<string, string> = {};
      const entries = Object.entries(providers);
      let pending = entries.length;
      entries.forEach(([name, p]) => {
        p.status().then((s) => {
          result[name] = s;
          if (--pending === 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
          }
        });
      });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/v1/tts') {
      let body = '';
      req.on('data', (chunk: any) => (body += chunk));
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          const provider = providers[data.provider];
          if (!provider) {
            res.statusCode = 400;
            res.end('unknown provider');
            return;
          }
          provider
            .tts(data.text, {
              language: data.language,
              voice: data.voice,
              outputFormat: data.outputFormat,
              options: data.options
            })
            .then((audioUrl) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ audioUrl }));
            })
            .catch((err) => {
              res.statusCode = 500;
              res.end(String(err));
            });
        } catch (e) {
          res.statusCode = 500;
          res.end(String(e));
        }
      });
      return;
    }

    res.statusCode = 404;
    res.end('not found');
  });
}
