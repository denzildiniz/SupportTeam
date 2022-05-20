const AssignedProduct = require("../models/assignedProduct");
const User = require("../models/user");
const Product = require("../models/product");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const checkPermission = require("../utility/checkPermission");

const createAssignedProduct = async (req, res) => {
  const { branch, user: userId, product: productId } = req.body;
  if (!branch || !userId) {
    throw new CustomError.BadRequestError("Please provide branch and userId");
  }

  const verifyuser = await User.findOne({ _id: userId });
  if (!verifyuser) {
    throw new CustomError.NotFoundError(`No user found with id ${userId}`);
  }

  if (verifyuser.branch !== branch) {
    throw new CustomError.BadRequestError("User needs to be from same branch");
  }
  if (verifyuser.role === "superadmin" && req.user.role === "admin") {
    throw new CustomError.UnauthorizedError(
      "Not authorize to proceed with this task"
    );
  }
  if (verifyuser.status !== "active") {
    throw new CustomError.BadRequestError("User is not active");
  }
  if (verifyuser.role === "admin" && req.user.role === "admin") {
    throw new CustomError.UnauthorizedError(
      "Not authorize to proceed with this task"
    );
  }

  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(`No product exist`);
  }
  if (product.tag !== "notassigned") {
    throw new CustomError.BadRequestError("product already in use");
  }

  await AssignedProduct.create({
    branch,
    user: userId,
    product: productId,
    assignedBy: req.user.userId,
  });
  await Product.findOneAndUpdate(
    { _id: productId },
    {
      tag: "assigned",
    }
  );
  res.status(StatusCodes.CREATED).json({ msg: "created" });
};

const getAllAssignedProduct = async (req, res) => {
  if (req.user.role === "superadmin") {
    const assignedList = await AssignedProduct.find({});
    res.status(StatusCodes.OK).json({ assignedList });
  }
  if (req.user.role === "admin") {
    const assignedList = await AssignedProduct.find({
      branch: req.user.branch,
    });
    res.status(StatusCodes.OK).json({ assignedList });
  }
};

const getSingleAssignedProduct = async (req, res) => {
  const { id: assignedDeviceId } = req.params;

  if (req.user.role === "superadmin") {
    const singleDoc = await AssignedProduct.findOne({ _id: assignedDeviceId });
    if (!singleDoc) {
      throw new CustomError.NotFoundError(
        `No document found with id ${assignedDeviceId}`
      );
    }
    res.send(singleDoc);
  }

  if (req.user.role === "admin") {
    const singleDoc = await AssignedProduct.findOne({
      _id: assignedDeviceId,
      branch: req.user.branch,
    });
    if (!singleDoc) {
      throw new CustomError.NotFoundError(
        `No document found with id ${assignedDeviceId}`
      );
    }
    res.send(singleDoc);
  }
};

const getCurrentUserAssignedProduct = async (req, res) => {
  const myList = await AssignedProduct.find({ user: req.user.userId });
  if (!myList) {
    throw new CustomError.NotFoundError("No devices assigned");
  }
  const [{ user: userId }] = myList;
  checkPermission(req.user, userId);
  res.status(StatusCodes.OK).json({ myList });
};

const removeAssignedProduct = async (req, res) => {
  // only update the devices[] check
  res.send("Update assigned prodduct");
};

// const deleteAssignedProduct = async (req, res) => {
//   will delete the entire document
//   res.send("Delete assigned prodduct");
// };

module.exports = {
  createAssignedProduct,
  getAllAssignedProduct,
  getSingleAssignedProduct,
  getCurrentUserAssignedProduct,
  removeAssignedProduct,
  // deleteAssignedProduct,
};
