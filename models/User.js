const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "please add a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minLength: 6,
    select: false,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: [true, "Please Add a Address"],
  },
  resetPasswordToken: String,
  resetPaswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//hash the plain text password
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//generate jwt token for authentication
UserSchema.methods.getSignedToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
};

const User = mongoose.model("users", UserSchema);

module.exports = User;
