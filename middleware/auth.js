const jwt = require("jsonwebtoken");
const User = require("../models/User");

//protect routes
exports.protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // make sure token exists
    if (!token) {
      res.status(404).send("token doesnot exist");
    }

    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(token);
    req.token = token;
    req.user = await User.findById(decoded.id);

    next();
  } catch (e) {
    res.status(400).send(e);
  }
};
