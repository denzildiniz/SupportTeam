const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermission, checkUserRole } = require("../utility");

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

const UpdateUserRole = async (req, res) => {
  const {
    params: { id: userId },
    body: { role },
  } = req;
  if (!role) {
    throw new CustomError.BadRequestError("Please specify the role");
  }
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new CustomError.BadRequestError(
      `No user found with UserId ${userId}`
    );
  }
  if (req.user.role !== "superadmin") {
    throw new CustomError.UnauthorizedError(
      "Not authorize to perform this task"
    );
  }
  user.role = role;
  await user.save();

  res.status(StatusCodes.OK).json({ user });
};

const UpdateUserPassword = (req, res) => {
  res.send("UpdateUserPassword");
};

module.exports = {
  getAllUsers,
  getSingleUser,
  UpdateUser,
  UpdateUserRole,
  UpdateUserPassword,
};
