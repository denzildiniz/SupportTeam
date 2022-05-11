const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authentication");

router
  .route("/")
  .get(authenticateUser, getAllProduct)
  .post(
    [authenticateUser, authorizeRoles("superadmin", "admin")],
    createProduct
  );

router
  .route("/:id")
  .get(
    [authenticateUser, authorizeRoles("superadmin", "admin")],
    getSingleProduct
  )
  .patch(
    [authenticateUser, authorizeRoles("superadmin", "admin")],
    updateProduct
  )
  .delete(
    [authenticateUser, authorizeRoles("superadmin", "admin")],
    deleteProduct
  );

module.exports = router;
