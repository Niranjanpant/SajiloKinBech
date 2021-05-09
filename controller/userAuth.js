const User = require("../models/User");

//@desc  register a user
//@route POST/api/v1/user
//@access Public

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = user.getSignedToken();
    res.status(200).json({ success: true, data: user, token: token });
  } catch (e) {
    res.status(400).send(e);
  }
};

//@desc  Login a user
//@route POST/api/v1/user
//@access Public

exports.loginUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({ success: true, data: user });
  } catch (e) {
    res.status(400).send(e);
  }
};

//@desc  update a user
//@route PUT/api/v1/user/:id
//@access Private

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ success: true, data: user });
  } catch (e) {
    res.status(400).send(e);
  }
};

//@desc  delete a user
//@route DELETE/api/v1/user/:id
//@access Private

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    user.remove();
    res.status(200).json({ success: true, data: user });
  } catch (e) {
    res.status(400).send(e);
  }
};
