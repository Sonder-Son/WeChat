const express = require('express');
const router = express.Router();

// Placeholder - lo implementaremos después
router.get('/', (req, res) => {
  res.json({ message: 'Posts route - to be implemented' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create post - to be implemented' });
});

module.exports = router;