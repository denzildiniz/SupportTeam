const AssignedProduct = require("../models/assignedProduct");
const User = require("../models/user");
const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createAssignedProduct = async (req, res) => {
  const { branch, user: userId, assignedDevices, assignedBy } = req.body;
  if (!branch || !userId) {
    throw new CustomError.BadRequestError("Please provide branch and userId");
  }

  if (!assignedDevices || assignedDevices.length < 1) {
    throw new CustomError.BadRequestError(
      "Please provide the product details to assign"
    );
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
  if (verifyuser.role === "admin" && req.user.role === "admin") {
    throw new CustomError.UnauthorizedError(
      "Not authorize to proceed with this task"
    );
  }

  let devicesToAssign = [];
  for (const singledevice of assignedDevices) {
    const dbProduct = await Product.findOne({ _id: singledevice.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product found with id ${device.product}`
      );
    }
    if (dbProduct.branch !== branch) {
      throw new CustomError.BadRequestError(
        "Product needs to be from same branch"
      );
    }
    const { device, _id } = dbProduct;
    const singleProduct = {
      device,
      product: _id.toString(),
    };
    devicesToAssign = [...devicesToAssign, singleProduct];
  }

  const assignedUserDevice = {
    branch,
    user: userId,
    assignedDevices: devicesToAssign,
    assignedBy: req.user.userId,
  };

  console.log(devicesToAssign);
  console.log(req.body);
  res.send(req.body);
};

const getAllAssignedProduct = async (req, res) => {
  res.send("getAll assigned prodduct");
};

const getSingleAssignedProduct = async (req, res) => {
  res.send("get Single assigned prodduct");
};

const getCurrentUserAssignedProduct = async (req, res) => {
  res.send("get Current User assigned prodduct");
};

const updateAssignedProduct = async (req, res) => {
  res.send("Update assigned prodduct");
};

const deleteAssignedProduct = async (req, res) => {
  res.send("Delete assigned prodduct");
};

module.exports = {
  createAssignedProduct,
  getAllAssignedProduct,
  getSingleAssignedProduct,
  getCurrentUserAssignedProduct,
  updateAssignedProduct,
  deleteAssignedProduct,
};
