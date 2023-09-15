const { Cart } = require("../models/Cart");

exports.fetchCartByUser = async (req, res) => {
  const { user } = req.query;
  try {
    const cartItems = await Cart.find({ user: user })
      .populate("user")
      .populate("product");
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(400).json(err);
  }
};

exports.addToCart = async (req, res) => {
  const cart = new Cart(req.body);
  try {
    const doc = await cart.save();
    const result = await doc.populate("product");
    res.status(201).json(result);
  } catch (err) {
    // Handle errors here
    res.status(400).json(err);
  }
};

exports.deleteFromCart = async (req, res) => {

    const {id} = req.params;
    try {
      const doc = await Cart.findByIdAndDelete(id);
      res.status(200).json(doc);
    } catch (err) {
      // Handle errors here
      res.status(400).json(err);
    }
  };

  exports.updateCart = async (req, res) => {
    const {id} = req.params;
   try {
    // here we have passed he option new: true which will return latest copy of updated item
    const cart = await Cart.findByIdAndUpdate(id, req.body, {new: true});
    const result = await cart.populate("product");
    res.status(200).json(result);
} catch (err) {
    // Handle errors here
    res.status(400).json(err);
  }
}
