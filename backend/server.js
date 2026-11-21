const { createApp } = require('./app');
const { readServerConfig } = require('./config/env');

try {
  const { host, port } = readServerConfig();

  createApp().listen(port, host, (error) => {
    if (error) {
      console.error(`CloudCare could not listen on ${host}:${port} (${error.code}).`);
      process.exitCode = 1;
      return;
    }

    console.log(`CloudCare listening on ${host}:${port}`);
  });
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
