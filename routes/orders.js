const express = require('express');
const Order = require('../models/Order');
const QRCodeModel = require('../models/QRCode');
const Tenant = require('../models/Tenant');
const router = express.Router();

// place order via QR token
router.post('/', async (req, res) => {
  try {
    const { qrToken, customerName, customerMobile, items } = req.body;
    if (!qrToken || !customerName || !items || !items.length) return res.status(400).json({ error: 'missing fields' });

    const qr = await QRCodeModel.findOne({ token: qrToken, active: true });
    if (!qr) return res.status(400).json({ error: 'invalid or inactive qr' });

    const tenantId = qr.tenantId;
    const tableId = qr.tableId;

    // compute subtotal & total (taxes handled separately)
    let subtotal = 0;
    const mappedItems = items.map(it => {
      const price = Number(it.price || 0);
      const qty = Number(it.qty || 1);
      subtotal += price * qty;
      return { menuItemId: it.menuItemId, name: it.name, price, qty };
    });

    // load tenant tax settings (simple example)
    const tenant = await Tenant.findById(tenantId);
    let taxes = [];
    let total = subtotal;
    if (tenant && tenant.taxSettings && tenant.taxSettings.enabled) {
      if (tenant.taxSettings.type === 'INTRA') {
        const sgst = +(subtotal * (tenant.taxSettings.sgstPercent || 0) / 100);
        const cgst = +(subtotal * (tenant.taxSettings.cgstPercent || 0) / 100);
        taxes.push({ type: 'SGST', percent: tenant.taxSettings.sgstPercent || 0, amount: sgst });
        taxes.push({ type: 'CGST', percent: tenant.taxSettings.cgstPercent || 0, amount: cgst });
        total += sgst + cgst;
      } else {
        const igst = +(subtotal * (tenant.taxSettings.igstPercent || 0) / 100);
        taxes.push({ type: 'IGST', percent: tenant.taxSettings.igstPercent || 0, amount: igst });
        total += igst;
      }
    }

    const order = await Order.create({
      tenantId, tableId, qrId: qr._id,
      customerName, customerMobile,
      items: mappedItems, subtotal, taxes, total
    });

    res.status(201).json({ ok: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// manager: list orders by tenant
router.get('/:tenantId', async (req, res) => {
  const orders = await Order.find({ tenantId: req.params.tenantId }).sort({ createdAt: -1 }).limit(200);
  res.json(orders);
});

module.exports = router;
