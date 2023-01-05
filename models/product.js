const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // device: {
    //   type: String,
    //   required: [true, "Please provide the type of device"],
    //   enum: {
    //     values: ["monitor", "mouse", "keyboard", "headphone"],
    //     message: "{VALUE} is not supported",
    //   },
    // },
    branch: {
      type: String,
      required: [true, "please provide a branch name"],
      enum: ["Goa", "Dhaka", "Sylhet"],
      default: "Goa",
    },
    dateOfPurchase: {
      type: String,
      default: Date,
    },
    productCategory: {
      type: String,
      trim: true,
      required:true,
    },
    productType: {
      type: String,
      trim: true,
      required:true,
    },
    warrantyPeriod: {
      type: String,
      trim: true,
    },
    systemName: {
      type: String,
      trim: true,
    },
    systemModel: {
      type: String,
      trim: true,
    },
    systemBrand:{
      type: String,
      trim: true,
    },
    cpu: {
      type: String,
      trim: true,
    },
    ram: {
      type: String,
      trim: true,
    },
    storageType: {
      type: String,
      trim: true,
    },
    storageCapacity: {
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
    productKey: {
      type: String,
      trim: true,
    },
    serialNumber: {
      type: String,
      trim: true,
    },
    accessoriesName: {
      type: String,
      trim: true,
    },
    networkDeviceName: {
      type: String,
      trim: true,
    },
    tag: {
      type: String,
      required: true,
      enum: {
        values: ["assigned", "notassigned"],
        message: "{VALUE} not supported",
      },
      default: "notassigned",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
