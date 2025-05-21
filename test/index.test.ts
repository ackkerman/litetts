import { equal } from './assert';
import { hello, createApp } from '../src/index';
import http from 'http';

function request(method: string, path: string, data: any, port: number): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const options = { method, hostname: 'localhost', port, path, headers: { 'Content-Type': 'application/json' } };
    const req = http.request(options, (res: any) => {
      let body = '';
      res.on('data', (c: any) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode || 0, body }));
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

(async () => {
  equal(hello('test'), 'Hello, test');

  const server = createApp().listen(0);
  const port = (server.address() as any).port;

  const providersRes = await request('GET', '/v1/providers', null, port);
  const providers = JSON.parse(providersRes.body).providers;
  equal(Array.isArray(providers), true);

  const ttsRes = await request(
    'POST',
    '/v1/tts',
    { provider: 'openai', text: 'hello', language: 'en-US', voice: 'nova', outputFormat: 'mp3' },
    port
  );
  const audioUrl = JSON.parse(ttsRes.body).audioUrl;
  equal(typeof audioUrl, 'string');

  server.close();
  console.log('test passed');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
