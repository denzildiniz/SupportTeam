const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const checkPermission = require("../utility/checkPermission");
const checkUserRole = require("../utility/checkUserRole");

const getAllUsers = async (req, res) => {
  const user = await User.find({}).select("-password");
  res.status(StatusCodes.OK).json({ user });
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`no user found with id ${userId}`);
  }
  checkPermission(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const UpdateUser = async (req, res) => {
  const {
    params: { id: userId },
    body: { fname, lname, branch, email, status },
  } = req;

  if (!fname || !lname || !branch || !email || !status) {
    throw new CustomError.BadRequestError("Please provide the required fields");
  }

  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new CustomError.NotFoundError(`No user found with id ${userId}`);
  }

  checkUserRole(req.user, user.role);

  user.fname = fname;
  user.lname = lname;
  user.branch = branch;
  user.email = email;
  user.status = status;

  await user.save();

  const token = await user.createJWT();
  res.status(StatusCodes.OK).json({ user, token: token });
};

const UpdateUserPassword = (req, res) => {
  res.send("UpdateUserPassword");
};

module.exports = {
  getAllUsers,
  getSingleUser,
  UpdateUser,
  UpdateUserPassword,
};
