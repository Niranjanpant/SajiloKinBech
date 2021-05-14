const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  value: {
    type: Number,
    required: [true, "Please add the value of your proprerty"],
  },
  description: {
    type: String,
    maxLength: [200, "Description cannot be longer than 200 character"],
  },
  photo: {
    type: String,
    default: "No-photo.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

const Property = mongoose.model("property", PropertySchema);

module.exports = Property;
