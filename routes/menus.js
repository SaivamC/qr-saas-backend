const express = require('express');
const Menu = require('../models/Menu');
const MenuItem = require('../models/MenuItem');
const router = express.Router();

// create menu item (tenantId required in body)
router.post('/items', async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// list menu items by tenant
router.get('/items/:tenantId', async (req, res) => {
  const items = await MenuItem.find({ tenantId: req.params.tenantId });
  res.json(items);
});

// create a menu (collection of items)
router.post('/', async (req, res) => {
  try {
    const m = await Menu.create(req.body);
    res.status(201).json(m);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// get menu for tenant (first published)
router.get('/:tenantId', async (req, res) => {
  const menu = await Menu.findOne({ tenantId: req.params.tenantId, published: true }).populate('items');
  res.json(menu);
});

module.exports = router;
