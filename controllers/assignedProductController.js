const AssignedProduct = require("../models/assignedProduct");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createAssignedProduct = async (req, res) => {
  res.send("create assigned prodduct");
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
