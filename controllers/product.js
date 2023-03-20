const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createProduct = async (req, res) => {
  req.body.createdBy = req.user.userId;
  if (req.user.role === "admin") {
    req.body.branch = req.user.branch;
  }
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProduct = async (req, res) => {
  const { branch, productCategory, productType, systemName, systemModel, systemBrand, cpu, ram, storageType, storageCapacity, os, macAddress, ipAddress, tag } = req.body; // for future search query
  const bodyObject = {};

  if (req.user.role === "admin") {
    bodyObject["branch"] = req.user.branch;
  } else if (req.user.role === "superadmin") {
    if (branch) {
      bodyObject["branch"] = branch;
    }
  }

  if (productCategory) {
    bodyObject["productCategory"] = productCategory;
  }

  if (productType) {
    bodyObject["productType"] = productType;
  }

  if (systemName) {
    bodyObject.systemName = { $regex: systemName, $options: 'i' };
  }

  if (systemModel) {
    bodyObject.systemModel = { $regex: systemModel, $options: 'i' };
  }

  if (systemBrand) {
    bodyObject.systemBrand = { $regex: systemBrand, $options: 'i' };
  }

  if (cpu) {
    bodyObject.cpu = { $regex: cpu, $options: 'i' };
  }

  if (ram) {
    bodyObject.ram = { $regex: ram, $options: 'i' };
  }

  if (storageType) {
    bodyObject.storageType = { $regex: storageType, $options: 'i' };
  }

  if (storageCapacity) {
    bodyObject.storageCapacity = { $regex: storageCapacity, $options: 'i' };
  }

  if (os) {
    bodyObject.os = { $regex: os, $options: 'i' };
  }

  if (macAddress) {
    bodyObject.macAddress = { $regex: macAddress, $options: 'i' };
  }

  if (ipAddress) {
    bodyObject.ipAddress = { $regex: ipAddress, $options: 'i' };
  }

  if (tag) {
    bodyObject["tag"] = tag;
  }
  // console.log('bodyObject', bodyObject);
  // res.status(StatusCodes.OK).send('ok');
  // return;

  const count = await Product.aggregate([
    { $match: bodyObject },
    { $count: "total" }
  ]);

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const productList = await Product.find(bodyObject)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = count.length ? count[0].total : 0;

  res.status(StatusCodes.OK).json({
    products: productList,
    totalCount: total,
    totalPages: Math.ceil(total / limit),
    currentPage: page
  });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(`no product found with ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  })

  if (!product) {
    throw new CustomError.NotFoundError(`No product found with ${productId}`)
  }

  res.status(StatusCodes.OK).json({ product })
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId })

  if (!product) {
    throw new CustomError.NotFoundError(`No product found with ${productId}`)
  }

  await product.remove();
  res.status(StatusCodes.OK).json({ msg: 'Product removed sucessfully' })
};

const deleteAllProduct = async (req, res) => {
  await Product.deleteMany({});
  res.status(StatusCodes.OK).json({ msg: 'All products Deleated' })
};

module.exports = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  deleteAllProduct,
};
