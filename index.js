// index.js – GSM HTTP bridge
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(morgan('combined'));

// Accept both JSON and form-encoded bodies (for GSM)
app.use(bodyParser.json({ limit: '100kb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Optional API key security (disable by leaving BRIDGE_API_KEY empty)
const API_KEY = process.env.BRIDGE_API_KEY || null;
if (API_KEY) {
  app.use((req, res, next) => {
    const key = req.get('x-api-key') || req.query.api_key;
    if (!key || key !== API_KEY) {
      return res.status(401).send('Unauthorized');
    }
    next();
  });
}

// === MAIN ENDPOINTS ===

// Test GET
app.get('/bridge', (req, res) => {
  console.log('GET /bridge query:', req.query);
  res.send('✅ Bridge received GET');
});

// Main POST for GSM
app.post('/bridge', (req, res) => {
  console.log('📩 POST /bridge body:', req.body);
  // Respond with plain text so GSM can read easily
  res.send('✅ OK - Data received');
});

// Root
app.get('/', (req, res) => res.send('🌐 GSM-HTTP Bridge alive'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 GSM HTTP bridge running on port ${PORT}`));
