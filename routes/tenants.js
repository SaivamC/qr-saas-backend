// routes/tenants.js
const express = require('express');
const Tenant = require('../models/Tenant');
const router = express.Router();

// create tenant (simple)
router.post('/', async (req, res) => {
  try {
    const t = await Tenant.create(req.body);
    res.status(201).json(t);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// get tenant by id
router.get('/:id', async (req, res) => {
  try {
    const t = await Tenant.findById(req.params.id);
    if (!t) return res.status(404).json({ error: 'Not found' });
    res.json(t);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
