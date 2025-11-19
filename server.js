// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// connect
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI not set - exiting');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('DB error:', err.message));

// mount routes (we'll create these files)
app.use('/api/tenants', require('./routes/tenants'));
app.use('/api/menus', require('./routes/menus'));
app.use('/api/tables', require('./routes/tables'));
app.use('/api/orders', require('./routes/orders'));

app.get('/', (req, res) => res.send('QR SaaS backend.'));

app.get('/health', (req, res) => {
  const state = mongoose.connection.readyState;
  res.json({ status: state === 1 ? 'ok' : 'down', dbState: state });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
