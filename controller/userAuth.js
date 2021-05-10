const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

//@desc  register a user
//@route POST/api/v1/userAuth/signup
//@access Public

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    //send email

    //generate token for the user
    const token = user.getSignedToken();

    sendEmail({
      email: user.email,
      subject: "Welcome to the Sajilokinbech family!",
      text:
        "You received this email because you have subscribed to the sajilokinbechfamily",
    });
    res.status(200).json({ success: true, data: user, token: token });
  } catch (e) {
    res.status(400).send(e);
  }
};

//@desc  Login a user
//@route POST/api/v1/userAuth/login
//@access Public

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //validate the email and password
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, data: "please add an email and password" });
    }
    //check for user
    const user = await User.findOne({ email: email }).select("+password");
    console.log("here too");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, data: "Invalid credentials" });
    }
    //check if the password is a match
    const isMatch = await user.matchPassword(password);
    console.log("not match");
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, data: "Invalid credentials" });
    }
    const token = user.getSignedToken();
    res.status(200).json({ success: true, token: token });
  } catch (e) {
    res.status(400).send(e);
  }
};

//@desc  update a user name and email
//@route PUT/api/v1/userAuth/updateDetails
//@access Private

exports.updateUser = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };
    const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: user });
  } catch (e) {
    res.status(400).send(e);
  }
};

//@desc  update a  password
//@route PUT/api/v1/userAuth/updatePassword
//@access Private

exports.updateUserPassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    //check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(404).send({ error: "Password is in correct" });
    }

    //set new password
    user.password = req.body.newPassword;
    await user.save();
    const token = user.getSignedToken();
    res.status(200).json({ success: true, data: user, token: token });
  } catch (e) {
    res.status(400).send(e);
  }
};

//@desc  get a currently logged in user
//@route GET/api/v1/userAuth/me
//@access Private

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (e) {
    res.status(400).send(e);
  }
};

//@desc  forgot password for users
//@route Password/api/v1/userAuth/forgotPassword
//@access Public

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send({ error: "user not found" });
    }

    //get the reset token
    const resetToken = user.getResetPasswordToken();
    await user.save();

    //send reset token
    //create url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/user/resetPassword/${resetToken}`;

    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      text: `You are receiving
   this email because you
    requested the reset of a password.Please
     make a put request to :\n\n${resetUrl}`,
    });

    res.status(200).json({ success: true, data: user });
  } catch (e) {
    console.log(e);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
  }
};

//@desc  resetPassword all users
//@route PUT/api/v1/userAuth/resetPassword/:resetToken
//@access public

exports.resetPassword = async (req, res, next) => {
  try {
    //get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send({ error: "Invalid token" });
    }

    //set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    const token = user.getSignedToken();

    res.status(200).json({ success: true, data: user, token: token });
  } catch (e) {
    console.log(e);
  }
};
