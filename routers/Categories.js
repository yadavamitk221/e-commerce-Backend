const express = require('express');
const { fetchCategories, createCategory } = require('../controllers/CategoryController');
const router = express.Router();

router.get('/', fetchCategories).post('/', createCategory);

exports.router = router;