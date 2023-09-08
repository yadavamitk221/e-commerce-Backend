const express = require('express');
const router = express.Router();
const {createProduct, fetchAllProduct, fetchProductById, updateProduct} = require('../controllers/ProductController');

router.post('/', createProduct)
      .get('/', fetchAllProduct)
      .get('/:id', fetchProductById)
      .patch('/:id', updateProduct)

exports.router = router;