// Simple Express bridge for GSM modules (GET/POST)
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(morgan('combined'));
app.use(bodyParser.json({ limit: '100kb' }));
app.use(bodyParser.urlencoded({ extended: true }));

const API_KEY = process.env.BRIDGE_API_KEY || null;
if (API_KEY) {
  app.use((req, res, next) => {
    const key = req.get('x-api-key') || req.query.api_key;
    if (!key || key !== API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  });
}

app.get('/bridge', (req, res) => {
  console.log('GET /bridge query:', req.query);
  res.json({
    ok: true,
    method: 'GET',
    receivedQuery: req.query
  });
});

app.post('/bridge', (req, res) => {
  console.log('POST /bridge body:', req.body);
  res.json({
    ok: true,
    method: 'POST',
    receivedBody: req.body
  });
});

app.get('/', (req, res) => res.send('GSM-HTTP Bridge alive'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`GSM HTTP bridge listening on port ${PORT}`);
});
