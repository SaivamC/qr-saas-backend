const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', index: true },
  title: { type: String, default: 'Main Menu' },
  published: { type: Boolean, default: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Menu', menuSchema);
