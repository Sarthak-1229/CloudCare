const express = require('express');
const path = require('node:path');
const fs = require('node:fs');

const { isReady } = require('./config/db');
const authRouter = require('./routes/auth');
const doctorsRouter = require('./routes/doctors');
const appointmentsRouter = require('./routes/appointments');
const prescriptionsRouter = require('./routes/prescriptions');
const reportsRouter = require('./routes/reports');
const adminRouter = require('./routes/admin');

function createApp() {
  const app = express();
  app.disable('x-powered-by');

  // Parse JSON payloads
  app.use(express.json());

  // Health check
  app.get('/api/health', (_request, response) => {
    response.set('Cache-Control', 'no-store').json({ status: 'ok' });
  });

  // Database readiness check
  app.get('/api/ready', async (_request, response) => {
    const ready = await isReady();
    if (ready) {
      return response.set('Cache-Control', 'no-store').status(200).json({ status: 'ready' });
    }
    return response.set('Cache-Control', 'no-store').status(503).json({
      error: { code: 'NOT_READY', message: 'Database readiness is unavailable.' },
    });
  });

  // Mount API routers
  app.use('/api/auth', authRouter);
  app.use('/api/doctors', doctorsRouter);
  app.use('/api/appointments', appointmentsRouter);
  app.use('/api/prescriptions', prescriptionsRouter);
  app.use('/api/reports', reportsRouter);
  app.use('/api/admin', adminRouter);

  // Serve static frontend build with optimized asset caching
  const distPath = path.join(__dirname, '../frontend/dist');
  if (fs.existsSync(distPath)) {
    app.use('/assets', express.static(path.join(distPath, 'assets'), {
      maxAge: '7d',
      immutable: true,
    }));

    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      },
    }));

    app.use((req, res, next) => {
      if (req.method === 'GET' && !req.path.startsWith('/api/')) {
        res.set('Cache-Control', 'no-cache');
        return res.sendFile(path.join(distPath, 'index.html'));
      }
      next();
    });
  }

  // 404 handler for unhandled routes
  app.use((_request, response) => {
    response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found.' } });
  });

  // Global error handler
  app.use((error, _request, response, next) => {
    if (response.headersSent) {
      return next(error);
    }
    console.error('Unhandled server error:', error);
    response.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected server error.' } });
  });

  return app;
}

module.exports = { createApp };
