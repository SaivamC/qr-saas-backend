const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', index: true },
  name: { type: String, required: true }, // e.g., "Table 1" or "Block A - Room 101"
  capacity: { type: Number, default: 4 },
  qrId: { type: mongoose.Schema.Types.ObjectId, ref: 'QRCode' },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Table', tableSchema);
