const express = require("express");
// const User = require("../models/User");
const {
  createUser,
  updateUser,
  updateUserPassword,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
} = require("../controller/userAuth");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/updateDetails", protect, updateUser);
router.put("/updatePassword", protect, updateUserPassword);

router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:resetToken", resetPassword);
router.get("/me", protect, getMe);

module.exports = router;
