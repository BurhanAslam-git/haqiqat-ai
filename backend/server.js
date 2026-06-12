require('dotenv').config();
const express = require('express');
const cors = require('cors');
const verifyRoute = require('./routes/verify');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:3000',
    process.env.FRONTEND_URL || '*',
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/verify', verifyRoute);

// Root health check
app.get('/', (req, res) => {
  res.json({
    name: 'HaqiqatAI Backend',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      verify: 'POST /api/verify',
      health: 'GET /api/verify/health',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 HaqiqatAI Backend running on http://localhost:${PORT}`);
  console.log(`📡 Verify endpoint: POST http://localhost:${PORT}/api/verify`);
  console.log(`❤️  Health check: GET  http://localhost:${PORT}/api/verify/health\n`);
});