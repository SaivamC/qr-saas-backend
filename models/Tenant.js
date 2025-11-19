const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerName: String,
  ownerEmail: String,
  planId: { type: String, default: 'free' },
  isActive: { type: Boolean, default: false },
  billingCustomerId: String,
  taxSettings: {
    enabled: { type: Boolean, default: false },
    type: { type: String, enum: ['INTRA','INTER'], default: 'INTRA' },
    sgstPercent: { type: Number, default: 0 },
    cgstPercent: { type: Number, default: 0 },
    igstPercent: { type: Number, default: 0 },
    inclusive: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tenant', tenantSchema);
