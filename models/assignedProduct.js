const mongoose = require("mongoose");

const signleDevice = mongoose.Schema({
  device: {
    type: String,
    required: [true, "Please provide the type of device"],
    enum: {
      values: ["monitor", "mouse", "keyboard", "headphone"],
      message: "{VALUE} is not supported",
    },
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const assignedProductSchema = mongoose.Schema({
  branch: {
    type: String,
    required: [true, "please provide a branch name"],
    enum: ["goa", "dhaka", "sylhet"],
    default: "goa",
  },
  assignedDate: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedDevices: [signleDevice],
  assignedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("AssignedProduct", assignedProductSchema);
