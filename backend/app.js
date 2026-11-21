const express = require('express');

function createApp() {
  const app = express();
  app.disable('x-powered-by');

  app.get('/api/health', (_request, response) => {
    response.set('Cache-Control', 'no-store').json({ status: 'ok' });
  });

  app.get('/api/ready', (_request, response) => {
    response.set('Cache-Control', 'no-store').status(503).json({
      error: { code: 'NOT_READY', message: 'Database readiness is unavailable.' },
    });
  });

  app.use((_request, response) => {
    response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found.' } });
  });

  app.use((error, _request, response, next) => {
    if (response.headersSent) {
      return next(error);
    }

    response.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected server error.' } });
  });

  return app;
}

module.exports = { createApp };
