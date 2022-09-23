const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "Please provide name"],
      maxlength: 50,
      minlength: 3,
    },
    lname: {
      type: String,
      required: [true, "Please provide name"],
      maxlength: 50,
      minlength: 3,
    },
    password: {
      type: String,
      required: [true, "please provide a password"],
      // maxlength: 50,
      minlength: 3,
    },
    branch: {
      type: String,
      required: [true, "please provide a branch name"],
      enum: ["Goa", "Dhaka", "Sylhet"],
      default: "Goa",
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide email"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    role: {
      type: String,
      enum: ["superadmin", "admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePasword = async function(userPassword){
  const isMatch = await bcrypt.compare(userPassword,this.password)
  return isMatch;
}

userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, email: this.email, role:this.role, branch:this.branch},
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}

module.exports = mongoose.model("User", userSchema);
