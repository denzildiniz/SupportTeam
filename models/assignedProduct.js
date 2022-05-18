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
  status:{
    type: String,
    required: true,
    enum: {
      values: ["active", "notactive"],
      message: "{VALUE} not supported",
    },
    default: "active",
  }
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

assignedProductSchema.statics.changeProductStatus = async function (devices) {
  try {
    let [{product:productId}] = devices;
     await this.model('Product').findOneAndUpdate({_id:productId},{
      tag:'assigned'
     })

} catch (error) {
  console.log(error.message)
}
};

assignedProductSchema.post('save',async function(){
  await this.constructor.changeProductStatus(this.assignedDevices)
})

module.exports = mongoose.model("AssignedProduct", assignedProductSchema);
