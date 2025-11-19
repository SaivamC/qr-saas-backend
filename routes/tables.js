const express = require('express');
const Table = require('../models/Table');
const QRCodeModel = require('../models/QRCode');
const router = express.Router();

// create a table and auto-generate token-based QR record
router.post('/', async (req, res) => {
  try {
    const { tenantId, name, capacity } = req.body;
    if (!tenantId || !name) return res.status(400).json({ error: 'tenantId and name required' });

    const table = await Table.create({ tenantId, name, capacity });

    // use Node's crypto randomUUID (Node 16+)
    const token = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : require('crypto').randomUUID();

    const qr = await QRCodeModel.create({
      tenantId,
      tableId: table._id,
      token,
      qrPath: `/menu?qr=${token}`, // placeholder URL path; later we will generate PNG and store in R2
      active: true
    });

    // link table -> qr
    table.qrId = qr._id;
    await table.save();

    res.status(201).json({ table, qr, qrPublicUrl: `${process.env.PUBLIC_SITE_BASE || ''}/menu?qr=${token}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// list tables by tenant
router.get('/:tenantId', async (req, res) => {
  const tables = await Table.find({ tenantId: req.params.tenantId }).populate('qrId');
  res.json(tables);
});

module.exports = router;
