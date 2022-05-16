const express = require("express");
const router = express.Router();

const {
  createAssignedProduct,
  getAllAssignedProduct,
  getSingleAssignedProduct,
  getCurrentUserAssignedProduct,
  updateAssignedProduct,
  deleteAssignedProduct,
} = require("../controllers/assignedProductController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authentication");

router
  .route("/")
  .post(
    [authenticateUser, authorizeRoles("superadmin", "admin")],
    createAssignedProduct
  )
  .get(
    [authenticateUser, authorizeRoles("superadmin", "admin")],
    getAllAssignedProduct
  );

router
  .route("/allMyProducts")
  .get(authenticateUser, getCurrentUserAssignedProduct);

router
  .route("/:id")
  .get(
    [authenticateUser, authorizeRoles("superadmin", "admin")],
    getSingleAssignedProduct
  )
  .patch(
    [authenticateUser, authorizeRoles("superadmin", "admin")],
    updateAssignedProduct
  )
  .delete(
    [authenticateUser, authorizeRoles("superadmin", "admin")],
    deleteAssignedProduct
  );

module.exports = router;
