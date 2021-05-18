const express = require("express");
// const User = require("../models/User");
const {
  createUser,
  updateUser,
  updateUserPassword,
  loginUser,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateUserAvatar,
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
router.put("/me/avatar", protect, updateUserAvatar);
router.get("/me/logout", protect, logout);

module.exports = router;
