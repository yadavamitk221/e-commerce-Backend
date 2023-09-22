const { Order } = require("../models/order");

exports.fetchOrderByUser = async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order.find({ user: id });
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
  const { id } = req.params;
  try {
    // here we have passed he option new: true which will return latest copy of updated item
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(order);
  } catch (err) {
    // Handle errors here
    res.status(400).json(err);
  }
};

exports.fetchAllOrders = async (req, res) => {
  // filter = {"category":"smartphone"}
  // sort = {_sort: "price"_order="desc"}
  // pagination = {_page:1,_limit=10}   

  let query = Order.find({deleted: {$ne:true}}); 
  let totalOrdersQuery = Order.find({deleted: {$ne:true}});

  // TODO: hOW TO GET SORT ON DISCOUNTED PRICE NOT ON ACTUAL PRICE
  if(req.query._sort && req.query._order){
      query = query.sort({[req.query._sort]: [req.query._order]});
  }

  const totalDocs = await totalOrdersQuery.count().exec();

  if(req.query._page && req.query._limit){
      const pageSize = req.query._limit;
      const page = req.query._page;
      query = query.skip(pageSize*(page - 1)).limit(pageSize);
  }
  try {
      const docs = await query.exec();
      res.set('X-Total-Count', totalDocs);
      res.status(200).json(docs);
  } catch (err) {
      // Handle errors here
      res.status(400).json(err);
    }
}