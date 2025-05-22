import test from 'node:test';
import assert from 'node:assert';
import http from 'http';
import { createApp } from '../src/server.js';

function get(port: number, path: string): Promise<{status: number, body: string}> {
  return new Promise((resolve, reject) => {
    http.get({ hostname: 'localhost', port, path }, (res: any) => {
      let data = '';
      res.on('data', (chunk: any) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode || 0, body: data }));
    }).on('error', reject);
  });
}

function post(port: number, path: string, json: any): Promise<{status: number, body: string}> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { hostname: 'localhost', port, path, method: 'POST', headers: { 'Content-Type': 'application/json' } },
      (res: any) => {
        let data = '';
        res.on('data', (chunk: any) => (data += chunk));
        res.on('end', () => resolve({ status: res.statusCode || 0, body: data }));
      }
    );
    req.on('error', reject);
    req.write(JSON.stringify(json));
    req.end();
  });
}

test('health check', async () => {
  const server = createApp().listen(0);
  const port = (server.address() as any).port;
  const res = await get(port, '/healthz');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body, JSON.stringify({ status: 'ok' }));
  server.close();
});

test('list providers', async () => {
  const server = createApp().listen(0);
  const port = (server.address() as any).port;
  const res = await get(port, '/v1/providers');
  const data = JSON.parse(res.body);
  assert.deepStrictEqual(Object.keys(data), ['providers']);
  assert.ok(Array.isArray(data.providers));
  assert.ok(data.providers.includes('polly'));
  server.close();
});

test('synthesize openai', async () => {
  const server = createApp().listen(0);
  const port = (server.address() as any).port;
  const res = await post(port, '/v1/tts', { provider: 'openai', text: 'hello' });
  assert.strictEqual(res.status, 200);
  const data = JSON.parse(res.body);
  assert.ok(typeof data.audioUrl === 'string');
  assert.ok(data.audioUrl.startsWith('https://example.com/openai-'));
  server.close();
});

test('synthesize polly', async () => {
  const server = createApp().listen(0);
  const port = (server.address() as any).port;
  const res = await post(port, '/v1/tts', { provider: 'polly', text: 'hi' });
  assert.strictEqual(res.status, 200);
  const data = JSON.parse(res.body);
  assert.ok(typeof data.audioUrl === 'string');
  assert.ok(data.audioUrl.startsWith('https://example.com/polly-'));
  server.close();
});
