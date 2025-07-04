const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const multer = require('multer');
const path = require('path');

// 🔐 Middleware to check if user is logged in
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash('error_msg', 'Please login first');
  res.redirect('/users/login');
}

// 📦 Multer storage config for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // ✅ now inside public
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});


const upload = multer({ storage: storage });

/* ---------------------------------------------
   📥 Add New Recipe
---------------------------------------------- */

// GET: Show add recipe form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('recipes/add');
});

// POST: Submit new recipe
router.post('/add', ensureAuthenticated, upload.single('image'), async (req, res) => {
  const { title, ingredients, instructions } = req.body;
  const image = req.file ? req.file.filename : '';

  try {
    const newRecipe = new Recipe({ title, ingredients, instructions, image });
    await newRecipe.save();
    req.flash('success_msg', 'Recipe added successfully');
    res.redirect('/recipes');
  } catch (err) {
    console.error(err);
    res.send('Error saving recipe');
  }
});

/* ---------------------------------------------
   📜 View All Recipes
---------------------------------------------- */

// GET: Show all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.render('recipes/index', { recipes });
  } catch (err) {
    console.error(err);
    res.send('Error fetching recipes');
  }
});

/* ---------------------------------------------
   ✏️ Edit Recipe
---------------------------------------------- */

// GET: Show edit form
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  res.render('recipes/edit', { recipe });
});

// POST: Submit edited recipe
router.post('/edit/:id', ensureAuthenticated, upload.single('image'), async (req, res) => {
  const { title, ingredients, instructions } = req.body;
  let updateData = { title, ingredients, instructions };

  if (req.file) {
    updateData.image = req.file.filename;
  }

  try {
    await Recipe.findByIdAndUpdate(req.params.id, updateData);
    req.flash('success_msg', 'Recipe updated successfully');
    res.redirect('/recipes');
  } catch (err) {
    console.error(err);
    res.send('Error updating recipe');
  }
});

/* ---------------------------------------------
   🗑️ Delete Recipe
---------------------------------------------- */

// GET: Delete a recipe
router.get('/delete/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Recipe deleted successfully');
    res.redirect('/recipes');
  } catch (err) {
    console.error(err);
    res.send('Error deleting recipe');
  }
});

module.exports = router;
