const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  name: String,
  email: { type: String, required: true, unique: false },
  role: { type: String, enum: ['owner','manager','staff'], default: 'manager' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
