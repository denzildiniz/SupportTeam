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

  if (req.user.role === "superadmin") {
    const response = await AssignedProduct.find({ status: "active" })
      .populate({ path: "user", select: "email fname lname username" })
      .populate({
        path: "product",
        select:
          "productType branch productCategory warrantyPeriod systemName systemModel systemBrand cpu ram storageType storageCapacity os macAddress productKey serialNumber accessoriesName networkDeviceName tag",
      })
      .populate({ path: "assignedBy", select: "email" });
    console.log(response);
    const finalResponse = response.map((item) => {
      const assignedDevicesList = {};
      assignedDevicesList._id = item._id;
      assignedDevicesList.firstName = item.user.fname;
      assignedDevicesList.lastName = item.user.lname;
      assignedDevicesList.email = item.user.email;
      assignedDevicesList.username = item.user.username;
      assignedDevicesList.branch = item.product.branch;
      assignedDevicesList.warrantyPeriod = item.product.warrantyPeriod;
      assignedDevicesList.productCategory = item.product.productCategory;
      assignedDevicesList.systemName = item.product.systemName;
      assignedDevicesList.systemModel = item.product.systemModel;
      assignedDevicesList.productType = item.product.productType;
      assignedDevicesList.systemBrand = item.product.systemBrand;
      assignedDevicesList.cpu = item.product.cpu;
      assignedDevicesList.ram = item.product.ram;
      assignedDevicesList.storageCapacity = item.product.storageCapacity;
      assignedDevicesList.os = item.product.os;
      assignedDevicesList.macAddress = item.product.macAddress;
      assignedDevicesList.productKey = item.product.productKey;
      assignedDevicesList.serialNumber = item.product.serialNumber;
      assignedDevicesList.accessoriesName =
        item?.product?.accessoriesName == undefined
          ? "--"
          : item?.product?.accessoriesName;
      assignedDevicesList.networkDeviceName =
        item?.product?.networkDeviceName == undefined
          ? "--"
          : item?.product?.networkDeviceName;
      assignedDevicesList.tag = item.product.tag;
      assignedDevicesList.storageType = item.product.storageType;
      assignedDevicesList.assignBy = item.assignedBy.email;
      assignedDevicesList.assignDate = item.createdAt;
      return assignedDevicesList;
    });
    // console.log("finalResponse", finalResponse);
    res.status(StatusCodes.OK).json({ assignedDevices: finalResponse });
  }
  if (req.user.role === "admin") {
    const response = await AssignedProduct.find({
      branch: req.user.branch,
      status: "active",
    })
      .populate({ path: "user", select: "email fname lname userName" })
      .populate({
        path: "product",
        select:
          "productType branch productCategory warrantyPeriod systemName systemModel systemBrand cpu ram storageType storageCapacity os macAddress productKey serialNumber accessoriesName networkDeviceName tag",
      })
      .populate({ path: "assignedBy", select: "email" });

    const finalResponse = response.map((item) => {
      const assignedDevicesList = {};
      assignedDevicesList._id = item._id;
      assignedDevicesList.firstname = item.user.fname;
      assignedDevicesList.lastName = item.user.lname;
      assignedDevicesList.email = item.user.email;
      assignedDevicesList.username = item.user.userName;
      assignedDevicesList.branch = item.product.branch;
      assignedDevicesList.warrantyPeriod = item.product.warrantyPeriod;
      assignedDevicesList.productCategory = item.product.productCategory;
      assignedDevicesList.systemName = item.product.systemName;
      assignedDevicesList.systemModel = item.product.systemModel;
      assignedDevicesList.productType = item.product.productType;
      assignedDevicesList.systemBrand = item.product.systemBrand;
      assignedDevicesList.cpu = item.product.cpu;
      assignedDevicesList.ram = item.product.ram;
      assignedDevicesList.storageCapacity = item.product.storageCapacity;
      assignedDevicesList.os = item.product.os;
      assignedDevicesList.macAddress = item.product.macAddress;
      assignedDevicesList.productKey = item.product.productKey;
      assignedDevicesList.serialNumber = item.product.serialNumber;
      assignedDevicesList.accessoriesName =
        item?.product?.accessoriesName == undefined
          ? "--"
          : item?.product?.accessoriesName;
      assignedDevicesList.networkDeviceName =
        item?.product?.networkDeviceName == undefined
          ? "--"
          : item?.product?.networkDeviceName;
      assignedDevicesList.tag = item.product.tag;
      assignedDevicesList.storageType = item.product.storageType;
      assignedDevicesList.assignBy = item.assignedBy.email;
      assignedDevicesList.assignDate = item.createdAt;
      return assignedDevicesList;
    });
    // console.log("finalResponse", finalResponse);
    res.status(StatusCodes.OK).json({ assignedDevices: finalResponse });
  }
};

const getSingleAssignedProduct = async (req, res) => {
  const { id: assignedDeviceId } = req.params;

  if (req.user.role === "superadmin") {
    const singleAssignedDevice = await AssignedProduct.findOne({
      _id: assignedDeviceId,
    })
      .populate({ path: "user", select: "email fname lname userName" })
      .populate({
        path: "product",
        select:
          "productType branch productCategory warrantyPeriod systemName systemModel systemBrand cpu ram storageType storageCapacity os macAddress productKey serialNumber accessoriesName networkDeviceName tag",
      })
      .populate({ path: "assignedBy", select: "email" });


    if (!singleAssignedDevice) {
      throw new CustomError.NotFoundError(
        `No document found with id ${assignedDeviceId}`
      );
    }
    res.status(StatusCodes.OK).json({ assignedDevice: singleAssignedDevice });
  }

  if (req.user.role === "admin") {
    const singleAssignedDevice = await AssignedProduct.findOne({
      _id: assignedDeviceId,
      branch: req.user.branch,
    })
      .populate({ path: "user", select: "email fname lname userName" })
      .populate({
        path: "product",
        select:
          "productType branch productCategory warrantyPeriod systemName systemModel systemBrand cpu ram storageType storageCapacity os macAddress productKey serialNumber accessoriesName networkDeviceName tag",
      })
      .populate({ path: "assignedBy", select: "email" });

    if (!singleAssignedDevice) {
      throw new CustomError.NotFoundError(
        `No document found with id ${assignedDeviceId}`
      );
    }
    res.status(StatusCodes.OK).json({ assignedDevice: singleAssignedDevice });
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
  res
    .status(StatusCodes.OK)
    .json({ message: "all assigned products deleated" });
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
