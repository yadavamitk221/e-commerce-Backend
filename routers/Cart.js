const express = require('express');
const { addToCart, fetchCartByUser, deleteFromCart, updateCart } = require('../controllers/CartController');
const router = express.Router();

router.post('/', addToCart)
      .get('/', fetchCartByUser)
      .delete('/:id', deleteFromCart)
      .patch('/:id', updateCart)
exports.router = router;