const assert = require('node:assert/strict');
const { once } = require('node:events');
const { after, before, test } = require('node:test');
const { createApp } = require('../backend/app');
const { readServerConfig } = require('../backend/config/env');

let server;
let baseUrl;

before(async () => {
  server = createApp().listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('GET /api/health reports liveness without service credentials', async () => {
  const response = await fetch(`${baseUrl}/api/health`);

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^application\/json/);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.has('x-powered-by'), false);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('GET /api/ready reports unavailable database readiness', async () => {
  const response = await fetch(`${baseUrl}/api/ready`);

  assert.equal(response.status, 503);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await response.json(), {
    error: { code: 'NOT_READY', message: 'Database readiness is unavailable.' },
  });
});

test('unavailable API routes return a JSON 404', async () => {
  const response = await fetch(`${baseUrl}/api/nonexistent`, { method: 'POST' });

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), {
    error: { code: 'NOT_FOUND', message: 'Route not found.' },
  });
});

test('server configuration defaults to loopback on port 3000', () => {
  assert.deepEqual(readServerConfig({}), { host: '127.0.0.1', port: 3000 });
});

test('server configuration accepts host and port overrides', () => {
  assert.deepEqual(readServerConfig({ HOST: '0.0.0.0', PORT: '8080' }), {
    host: '0.0.0.0',
    port: 8080,
  });
});

test('server configuration rejects invalid port values', () => {
  for (const port of ['', '0', '65536', '-1', '8080.5', '3e3', 'invalid']) {
    assert.throws(() => readServerConfig({ PORT: port }), /PORT must be an integer/);
  }
});
