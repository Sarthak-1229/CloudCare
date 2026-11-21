function readServerConfig(env = process.env) {
  const rawPort = env.PORT ?? '3000';
  const port = Number(rawPort);

  if (!/^\d{1,5}$/.test(rawPort) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer from 1 to 65535.');
  }

  return { host: env.HOST?.trim() || '127.0.0.1', port };
}

module.exports = { readServerConfig };
