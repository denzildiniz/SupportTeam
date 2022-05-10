const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createProduct = async (req, res) => {
  res.send("createProduct route");
};

const getAllProduct = async (req, res) => {
  res.send("getAllProduct route");
};

const getSingleProduct = async (req, res) => {
  res.send("getSingleProduct route");
};

const updateProduct = async (req, res) => {
  res.send("updateProduct route");
};

const deleteProduct = async (req, res) => {
  res.send("deleteProduct route");
};

module.exports = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
