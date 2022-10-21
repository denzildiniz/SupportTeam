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

  const checkActiveDocExists = await AssignedProduct.findOne({
    product: productId,
    status: "active",
  });
  if (checkActiveDocExists) {
    throw new CustomError.BadRequestError(`Product already in use`);
  }

  try {
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
  } catch (error) {
    res.send(error.message);
  }
  res.status(StatusCodes.CREATED).json({ msg: "created" });
};

const getAllAssignedProduct = async (req, res) => {
  // Global object created to store values
  // const assignedDevicesList = {
  //   _id: "",
  //   userFname: "",
  //   userLname: "",
  //   userEmail: "",
  //   productType: "",
  //   assignBy: "",
  //   assignDate: "",
  // };

  if (req.user.role === "superadmin") {
    const response = await AssignedProduct.find({ status: "active" })
      .populate({ path: "user", select: "email fname lname" })
      .populate({ path: "product", select: "productType" })
      .populate({ path: "assignedBy", select: "email" });

    const finalResponse = response.map((item) => {
      const assignedDevicesList = {};
      assignedDevicesList._id = item._id;
      assignedDevicesList.userFname = item.user.fname;
      assignedDevicesList.userLname = item.user.lname;
      assignedDevicesList.userEmail = item.user.email;
      assignedDevicesList.productType = item.product.productType;
      assignedDevicesList.assignBy = item.assignedBy.email;
      assignedDevicesList.assignDate = item.createdAt;
      return assignedDevicesList;
    });
    console.log('finalResponse', finalResponse);
    res.status(StatusCodes.OK).json({ assignedDevices: finalResponse });
  }
  if (req.user.role === "admin") {
    const response = await AssignedProduct.find({
      branch: req.user.branch,
      status: "active",
    })
      .populate({ path: "user", select: "email fname lname" })
      .populate({ path: "product", select: "device" })
      .populate({ path: "assignedBy", select: "email" });

    const finalResponse = response.map((item) => {
      const assignedDevicesList = {};
      assignedDevicesList._id = item._id;
      assignedDevicesList.userFname = item.user.fname;
      assignedDevicesList.userLname = item.user.lname;
      assignedDevicesList.userEmail = item.user.email;
      assignedDevicesList.productType = item.product.productType;
      assignedDevicesList.assignBy = item.assignedBy.email;
      assignedDevicesList.assignDate = item.createdAt;
      return assignedDevicesList;
    });

    res.status(StatusCodes.OK).json({ assignedDevices: finalResponse });
  }
};

const getSingleAssignedProduct = async (req, res) => {
  const { id: assignedDeviceId } = req.params;

  if (req.user.role === "superadmin") {
    const singleDoc = await AssignedProduct.findOne({
      _id: assignedDeviceId,
    })
      .populate({ path: "user", select: "fname branch email status" })
      .populate({ path: "product", select: "device branch tag" });
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
  const myList = await AssignedProduct.find({
    user: req.user.userId,
    status: "active",
  });
  if (!myList) {
    throw new CustomError.NotFoundError("No devices assigned");
  }
  const [{ user: userId }] = myList;
  checkPermission(req.user, userId);
  res.status(StatusCodes.OK).json({ myList });
};

const removeAssignedProduct = async (req, res) => {
  const {
    params: { id: assignedDeviceId },
    // body: { product: productId },
  } = req;
  const assignedDevice = await AssignedProduct.findOne({
    _id: assignedDeviceId,
    // product: productId,
  });
  if (!assignedDevice) {
    throw new CustomError.NotFoundError(
      `No document found with id ${assignedDeviceId}`
    );
  }
  try {
    const response = await AssignedProduct.findOneAndUpdate(
      { _id: assignedDeviceId },
      {
        status: "inactive",
      }
    );

    const { product: productId } = response;

    await Product.findOneAndUpdate(
      { _id: productId },
      {
        tag: "notassigned",
      }
    );
  } catch (error) {
    res.send(error.message);
  }

  res.status(StatusCodes.OK).json({ msg: "updated" });
};

const deleteAllAssignedProduct = async (req, res) => {
  await AssignedProduct.deleteMany({});
  res.status(StatusCodes.OK).json({message:'all assigned products deleated'})
};

module.exports = {
  createAssignedProduct,
  getAllAssignedProduct,
  getSingleAssignedProduct,
  getCurrentUserAssignedProduct,
  removeAssignedProduct,
  deleteAllAssignedProduct,
  // deleteAssignedProduct,
};
