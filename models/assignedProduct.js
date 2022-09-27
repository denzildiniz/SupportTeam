const mongoose = require("mongoose");

const assignedProductSchema = mongoose.Schema(
  {
    branch: {
      type: String,
      required: [true, "please provide a branch name"],
      enum: ["Goa", "Dhaka", "Sylhet"],
      default: "Goa",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["active", "inactive"],
        message: "{VALUE} not supported",
      },
      default: "active",
    },
    assignedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AssignedProduct", assignedProductSchema);
