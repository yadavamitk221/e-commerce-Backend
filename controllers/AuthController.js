const { User } = require("../models/User");

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const response = await user.save();
    res.status(201).json({id:response.id, role:response.role});
  } catch (err) {
    // Handle errors here
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if(user.password == req.body.password) {
    }
    if (!user) {
      res.status(401).json({ message: "no such user email" });
    } else if(user.password === req.body.password) {
      // TODO: WE WILL MAKE ADDRESSES INDEPENDENT OF LOGIN
      res.status(200).json({id:user.id, role:user.role});
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  } catch (err) {
    // Handle errors here
    res.status(400).json(err);
  }
};
