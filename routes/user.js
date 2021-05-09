const express = require("express");
// const User = require("../models/User");
const {
  createUser,
  updateUser,
  deleteUser,
} = require("../controller/userAuth");
const router = express.Router();

router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
