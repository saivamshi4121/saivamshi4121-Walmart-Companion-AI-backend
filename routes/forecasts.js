const express = require('express');
const router = express.Router();
const forecasts = require('../data/store1_forecasts.json');

// GET /api/forecasts?dept=Dept_1&start=2012-10-28&end=2012-11-18
router.get('/', (req, res) => {
  const { dept, start, end } = req.query;
  let data = forecasts;
  if (dept) {
    data = { [dept]: forecasts[dept] || [] };
  }
  if (start || end) {
    for (const d in data) {
      data[d] = data[d].filter(item => {
        const date = new Date(item.ds);
        const afterStart = start ? date >= new Date(start) : true;
        const beforeEnd = end ? date <= new Date(end) : true;
        return afterStart && beforeEnd;
      });
    }
  }
  res.json(data);
});

module.exports = router; 