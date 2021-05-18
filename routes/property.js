const express = require("express");
const {
  createProperty,
  getUserProperty,
  getAllProperties,
  deleteProperty,
  updateProperty,
  uploadPhotoProperty,
} = require("../controller/property");
const router = express.Router();
const { protect } = require("../middleware/auth");

router.post("/create", protect, createProperty);
router.get("/getUserProperty", protect, getUserProperty);
router.get("/getAll", getAllProperties);
router.delete("/delete/:id", protect, deleteProperty);
router.put("/update/:id", protect, updateProperty);
router.put("/updatePhoto/:id", protect, uploadPhotoProperty);

module.exports = router;
