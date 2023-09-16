const express = require('express');
      const { createOrder, fetchOrderByUser, deleteOrder, updateOrder, fetchAllOrders } = require('../controllers/Order');
const router = express.Router();
// order is already added in base path
router.post('/', createOrder)
      .get('/:id', fetchOrderByUser)
      .delete('/:id', deleteOrder)
      .patch('/:id', updateOrder)
      .get('/', fetchAllOrders)
exports.router = router;