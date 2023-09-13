const { User } = require("../models/User");

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    console.log(req.body);
    const response = await user.save();
    console.log(response);
    res.status(201).json(response);
  } catch (err) {
    // Handle errors here
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if(user.password == req.body.password) {
      console.log("true");
    }
    if (!user) {
      res.status(401).json({ message: "no such user email" });
    } else if(user.password === req.body.password) {
      // TODO: WE WILL MAKE ADDRESSES INDEPENDENT OF LOGIN
      res.status(200).json({id:user.id, email:user.email, name:user.name, addresses: user.addresses});
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  } catch (err) {
    // Handle errors here
    res.status(400).json(err);
  }
};
