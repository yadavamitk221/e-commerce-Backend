const { User } = require("../models/User");

exports.fetchUserById= async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        res.status(200).json({id: user.id, addresses: user.addresses, email: user.email, role:user.role});
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.updateUser = async (req, res) => {
    const id = req.params.id;
    try {
    // here we have passed he option new: true which will return latest copy of updated item
    const user = await User.findByIdAndUpdate(id, req.body, {new: true});
    res.status(200).json(user);
} catch (err) {
    // Handle errors here
    res.status(400).json(err);
  }
}