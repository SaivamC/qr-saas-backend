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

// debug-route-loader.js (temp code to paste into server.js before mounting)
// function loadRoute(path) {
//   const loaded = require(path);
//   // log helpful info
//   console.log('Loaded', path, 'type:', typeof loaded);
//   // If it's an object with default (interop) log that
//   if (loaded && typeof loaded === 'object' && loaded.default) {
//     console.log(' -> has default export (likely ESM interop). keys:', Object.keys(loaded));
//   } else if (loaded && loaded.stack && Array.isArray(loaded.stack)) {
//     console.log(' -> Looks like an express Router (has stack).');
//   } else {
//     console.log(' -> keys:', loaded && Object.keys(loaded));
//   }
//   return loaded;
// }

// // use it to load routes and mount
// const tenantsRoute = loadRoute('./routes/tenants');
// const menusRoute = loadRoute('./routes/menus');
// const tablesRoute = loadRoute('./routes/tables');
// const ordersRoute = loadRoute('./routes/orders');

// // prefer function (router) or .default fallback
// function mountRoute(path, routeObj) {
//   if (typeof routeObj === 'function') return app.use(path, routeObj);
//   if (routeObj && routeObj.default && typeof routeObj.default === 'function') return app.use(path, routeObj.default);
//   // if it's a router-like object (has stack) mount it
//   if (routeObj && routeObj.stack && Array.isArray(routeObj.stack)) return app.use(path, routeObj);
//   throw new Error(`Route at ${path} is not a valid router`);
// }

// mountRoute('/api/tenants', tenantsRoute);
// mountRoute('/api/menus', menusRoute);
// mountRoute('/api/tables', tablesRoute);
// mountRoute('/api/orders', ordersRoute);
//

app.get('/', (req, res) => res.send('QR SaaS backend.'));

app.get('/health', (req, res) => {
  const state = mongoose.connection.readyState;
  res.json({ status: state === 1 ? 'ok' : 'down', dbState: state });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
