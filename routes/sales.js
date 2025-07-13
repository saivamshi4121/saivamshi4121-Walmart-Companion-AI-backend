const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const csvPath = path.join(__dirname, '../data/sales.csv');

// GET /api/sales?store=1&dept=1&start=2010-02-05&end=2010-06-11
router.get('/', (req, res) => {
  const { store, dept, start, end } = req.query;
  const results = [];
  fs.createReadStream(csvPath)
    .on('error', err => res.status(500).json({ message: 'Error reading sales data' }))
    .pipe(require('csv-parser')())
    .on('data', (row) => {
      if ((store && row.Store !== store) || (dept && row.Dept !== dept)) return;
      const date = row.Date;
      if ((start && date < start) || (end && date > end)) return;
      results.push(row);
    })
    .on('end', () => {
      res.json(results);
    });
});

module.exports = router; 