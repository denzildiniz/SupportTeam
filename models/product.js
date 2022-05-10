const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  device: {
    type: String,
    required: [true, "Please provide the type of device"],
    enum: {
      values: ["monitor", "mouse", "keyboard", "headphone"],
      message: "{VALUE} is not supported",
    },
  },
  dateOfPurchase: {
    type: Date,
    default: Date.now(),
  },
  // Properties Specific To PC
  systemName: {
    type: String,
    // required:true,
  },
  cpu: {
    type: String,
    trim: true,
  },
  ram: {
    type: String,
    trim: true,
  },
  hdd: {
    type: String,
    trim: true,
  },
  os: {
    type: String,
    trim: true,
  },
  macAddress: {
    type: String,
    trim: true,
  },
  ipAddress: {
    type: String,
    trim: true,
  },
  windowVersion: {
    type: String,
    enum: {
      values: ["window10", "window8", "winddow7"],
      message: "{VALUE} is not supported",
    },
  },
  // Properties Specific To Mouse
  // Properties Specific To Keyboard
  tag: {
    type: String,
    required: true,
    enum: {
      values: ["assigned", "notassigned"],
      message: "{VALUE} not supported",
    },
    default: "notassigned",
  },
  branch: {
    type: String,
    required: [true, "please provide a branch name"],
    enum: ["goa", "dhaka", "sylhet"],
    default: "goa",
  },
});

module.exports = mongoose.model("Product", productSchema);
