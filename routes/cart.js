const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const cartPath = path.join(__dirname, '../data/cart.json');

// Helper to read cart
function readCart() {
  return JSON.parse(fs.readFileSync(cartPath, 'utf-8'));
}

router.get('/', (req, res) => {
  res.json(readCart());
});

router.post('/', (req, res) => {
  const newCart = req.body;
  fs.writeFileSync(cartPath, JSON.stringify(newCart, null, 2));
  res.json({ message: 'Cart updated.' });
});

module.exports = router; 