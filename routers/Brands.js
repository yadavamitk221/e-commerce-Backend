const express = require('express');
const { fetchBrands, createBrands } = require('../controllers/BrandController');
const router = express.Router();

router.get('/', fetchBrands).post('/', createBrands);

exports.router = router;