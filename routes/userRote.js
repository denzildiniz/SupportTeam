const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  UpdateUser,
  UpdateUserRole,
  UpdateUserPassword,
} = require("../controllers/userController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authentication");

router
  .route("/")
  .get([authenticateUser, authorizeRoles("superadmin", "admin")], getAllUsers);
router
  .route("/UpdateUserRole/:id")
  .patch(authenticateUser, authorizeRoles("superadmin"), UpdateUserRole);
router
  .route("/updateuser/:id")
  .patch(authenticateUser, authorizeRoles("superadmin", "admin"), UpdateUser);

// route pending yet
router.route("/UpdateUserPassword").patch(UpdateUserPassword);

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
