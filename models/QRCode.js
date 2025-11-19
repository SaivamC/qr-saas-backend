const mongoose = require('mongoose');

const qrSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', index: true },
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
  token: { type: String, required: true, unique: true }, // secure token
  qrPath: String, // future: store R2 path or URL to PNG
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QRCode', qrSchema);
