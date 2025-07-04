const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// GET: Register page
router.get('/register', (req, res) => {
  res.render('users/register');
});

// POST: Register user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  let errors = [];

  if (!username || !password) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  const userExists = await User.findOne({ username });
  if (userExists) {
    errors.push({ msg: 'Username already exists' });
  }

  if (errors.length > 0) {
    res.render('users/register', { errors, username });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    req.flash('success_msg', 'You are now registered. Please login.');
    res.redirect('/users/login');
  }
});

// GET: Login page
router.get('/login', (req, res) => {
  res.render('users/login');
});

// POST: Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/recipes',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// GET: Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
});

module.exports = router;
