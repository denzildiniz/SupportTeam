const User = require("../models/user");
const { StatusCodes, OK } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermission, checkUserRole } = require("../utility");
// const user = require("../models/user");
const { json } = require("express");

// const getAllUsers = async (req, res) => {
//   const result = await User.find({}).select("-password");
//   const user = result.filter((item) => item.role !== "superadmin");
//   res.status(StatusCodes.OK).json({ user });
// };

const getAllUsers = async (req, res) => {
  const { username, email } = req.query;
  const queryObject = {};

  if (req.query.page === '-1') {
    if (req.user.role === 'superadmin') {
      const users = await User.find({}, '-password').lean();
      res.status(StatusCodes.OK).json({ user: users, count: users.length });
      return;
    } else if (req.user.role === 'admin') {
      queryObject.branch = req.user.branch;
    }
  } else if (req.user.role === 'admin') {
    queryObject.branch = req.user.branch;
  }

  if (username) {
    queryObject.username = { $regex: username, $options: 'i' };
  }

  if (email) {
    queryObject.email = { $regex: email, $options: 'i' };
  }

  const userCount = await User.countDocuments(queryObject);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const finalUserList = await User.find(queryObject, '-password')
    .lean()
    .skip(skip)
    .limit(limit);

  res.status(StatusCodes.OK).json({ user: finalUserList, nbhits: userCount });
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`no user found with id ${userId}`);
  }
  // check for admin branch
  if (req.user.role === 'admin') {
    if (req.user.branch !== user.branch) {
      throw new CustomError.UnauthorizedError("Not authorize to perform this task");
    }
  }
  checkPermission(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const UpdateUser = async (req, res) => {
  const {
    params: { id: userId },
    body: { fname, lname, branch, email, status, role },
  } = req;

  if (!fname || !lname || !branch || !email || !status || !role) {
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
  user.role = role;

  await user.save();

  const token = await user.createJWT();
  res.status(StatusCodes.OK).json({ user, token: token });
};

const UpdateUserRole = async (req, res) => {
  // const {
  //   params: { id: userId },
  //   body: { role },
  // } = req;
  // if (!role) {
  //   throw new CustomError.BadRequestError("Please specify the role");
  // }
  // const user = await User.findOne({ _id: userId });
  // if (!user) {
  //   throw new CustomError.BadRequestError(
  //     `No user found with UserId ${userId}`
  //   );
  // }
  // if (req.user.role !== "superadmin") {
  //   throw new CustomError.UnauthorizedError(
  //     "Not authorize to perform this task"
  //   );
  // }
  // user.role = role;
  // await user.save();

  // res.status(StatusCodes.OK).json({ user });
  res.status(StatusCodes.OK).json({ message: "Depricated endPoint" });
};

const deleteAllUsers = async (req, res) => {
  await User.deleteMany({ role: "user" });
  res.status(StatusCodes.OK).json({ message: "All users deleated" });
};

const UpdateUserPassword = (req, res) => {
  res.send("UpdateUserPassword");
};

module.exports = {
  getAllUsers,
  getSingleUser,
  UpdateUser,
  UpdateUserRole,
  deleteAllUsers,
  UpdateUserPassword,
};
