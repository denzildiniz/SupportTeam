const CustomError = require("../errors");

const checkPermission = (requestedUser, resourseUserId) => {
  if (requestedUser.role === "superadmin" || requestedUser.role === "admin")
    return;
  if (requestedUser.userId === resourseUserId.toString()) return;
  throw new CustomError.UnauthorizedError("Not authorize to access this route");
};

module.exports = checkPermission ;
