const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API is running', endpoints: ['/user/:id', '/user'] });
});

module.exports = router;