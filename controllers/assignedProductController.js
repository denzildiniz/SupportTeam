const AssignedProduct = require("../models/assignedProduct");
const User = require("../models/user");
const Product = require("../models/product");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createAssignedProduct = async (req, res) => {
  const { branch, user: userId, assignedDevices } = req.body;
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
  if (verifyuser.status !== "active") {
    throw new CustomError.BadRequestError("User is not active");
  }
  if (verifyuser.role === "admin" && req.user.role === "admin") {
    throw new CustomError.UnauthorizedError(
      "Not authorize to proceed with this task"
    );
  }

  const userExists = await AssignedProduct.findOne({ user: userId });
  if (userExists) {
    throw new CustomError.BadRequestError("User already exists in db");
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
    if (dbProduct.tag === "assigned") {
      throw new CustomError.BadRequestError("Product already in use");
    }
    const { device, _id } = dbProduct;
    const singleProduct = {
      device,
      product: _id.toString(),
    };
    devicesToAssign = [...devicesToAssign, singleProduct];
  }

  const assignedDevicesResult = new AssignedProduct({
    branch,
    user: userId,
    assignedDevices: devicesToAssign,
    assignedBy: req.user.userId,
  });
  const result = await assignedDevicesResult.save();

  res
    .status(StatusCodes.CREATED)
    .json({ assignedDevices: result, msg: "success" });
};

const removeAssignedProduct = async (req, res) => {
  // const { id: assignedProductId } = req.params;
  const {
    params: { id: assignedProductId },
    body: {
      user: userId,
      assignedDevices: [{ product: productId }],
    },
  } = req;

  const assignedProduct = await AssignedProduct.findOne({
    _id: assignedProductId,
  });
  if (!assignedProduct) {
    throw new CustomError.NotFoundError(
      `No Document exits with Id ${assignedProductId}`
    );
  }

  if (assignedProduct.user.toString() !== userId) {
    throw new CustomError.BadRequestError(
      `User dose'nt match with dataBase entry`
    );
  }

  let newlist = assignedProduct.assignedDevices;

  for (const list of newlist) {
    if (list.product.toString() === productId) {
      console.log(list.product.toString() + "and" + productId);
      list.status = "inactive";
    }
  }
  await AssignedProduct.findOneAndUpdate(
    { _id: assignedProductId },
    {
      assignedDevices: newlist,
    }
  );
  const product = await Product.findOneAndUpdate(
    { _id: productId },
    {
      tag: "notassigned",
    }
  );
  if(!product){
    throw new CustomError.NotFoundError('no match sorry')
  }

  res.send("success");
  // console.log(assignedProduct);
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
  // only update the devices[] check
  res.send("Update assigned prodduct");
};

const deleteAssignedProduct = async (req, res) => {
  // will delete the entire document
  res.send("Delete assigned prodduct");
};

module.exports = {
  createAssignedProduct,
  removeAssignedProduct,
  getAllAssignedProduct,
  getSingleAssignedProduct,
  getCurrentUserAssignedProduct,
  updateAssignedProduct,
  deleteAssignedProduct,
};
