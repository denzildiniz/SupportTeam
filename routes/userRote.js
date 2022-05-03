const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  UpdateUser,
  UpdateUserPassword,
} = require("../controllers/userController");
const { authenticateUser, authorizeRoles } = require("../middleware/authentication");


router.route("/").get([authenticateUser,authorizeRoles('superadmin','admin')], getAllUsers);
router.route("/updateUser").post(authenticateUser,UpdateUser);

// route pending yet 
router.route("/UpdateUserPassword").patch(UpdateUserPassword);

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
