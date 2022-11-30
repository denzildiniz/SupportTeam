const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const registerUser = async (req, res) => {
  // console.log(req.body)
  const { fname, lname, password, branch, email, userName } = req.body;

  const emailExist = await User.findOne({ email });
  if (emailExist) {
    throw new CustomError.BadRequestError("Email already in Use");
  }

  const CheckUserNameExists = await User.findOne({ userName });
  if (CheckUserNameExists) {
    throw new CustomError.BadRequestError("Please use different UserName");
  }

  // first account to register as superAdmin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "superadmin" : "user";

  const user = await User.create({
    fname,
    lname,
    password,
    branch,
    email,
    role,
    userName,
  });
  res.status(StatusCodes.CREATED).json({ msg: "Registered user successfully" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide Email and Password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid credentionals");
  }

  const correctPassword = await user.comparePasword(password);
  if (!correctPassword) {
    throw new CustomError.UnauthenticatedError("Invalid Credentionals");
  }

  const token = await user.createJWT();
  res.status(StatusCodes.ACCEPTED).json({ token });
};

const logoutUser = async (req, res) => {
  console.log("we have success");
  res.status(200).send("logOut");
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
