const { Order } = require("../models/order");

exports.fetchOrderByUser = async (req, res) => {
  console.log("req.query", req.params);
  const { id } = req.params;
  try {
    const orders = await Order.find({ user: id });
    console.log("orders",orders);
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.createOrder = async (req, res) => {
  const order = new Order(req.body);
  try {
    const doc = await order.save();
    res.status(201).json(doc);
  } catch (err) {
    // Handle errors here
    res.status(400).json(err);
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(order);
  } catch (err) {
    // Handle errors here
    res.status(400).json(err);
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params.id;
  try {
    // here we have passed he option new: true which will return latest copy of updated item
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(order);
  } catch (err) {
    // Handle errors here
    res.status(400).json(err);
  }
};
