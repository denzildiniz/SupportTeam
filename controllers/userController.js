const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const checkPermission = require("../utility/checkPermission");

const getAllUsers = async (req, res) => {
  const user = await User.find({}).select("-password");
  res.status(StatusCodes.OK).json({ user });
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await findOne({ _id: userId }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`no user found with id ${userId}`);
  }
  checkPermission(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const UpdateUser = async (req, res) => {
  res.send("UpdateUser");
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
