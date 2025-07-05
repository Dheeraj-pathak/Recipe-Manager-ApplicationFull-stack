const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res) => {
  res.redirect('/recipes'); // ✅ Redirect to main recipe list
});

module.exports = router;
