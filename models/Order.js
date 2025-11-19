const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', index: true },
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
  qrId: { type: mongoose.Schema.Types.ObjectId, ref: 'QRCode' },
  customerName: { type: String, required: true },
  customerMobile: String,
  items: [{
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name: String,
    qty: Number,
    price: Number
  }],
  subtotal: Number,
  taxes: [{ type: Object }],
  total: Number,
  status: { type: String, enum: ['pending','preparing','ready','served','cancelled'], default: 'pending' },
  payment: { provider: String, providerPaymentId: String, status: String, platformFee: Number, hotelPayoutAmount: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
