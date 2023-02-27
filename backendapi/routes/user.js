const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

// Protected route
router.get('/profile', auth, (req, res) => {
  res.send('Welcome to your profile!');
});

module.exports = router;