const  verifySignUp  = require("../middleware/verifySignUp");
const controller = require("../controllers/auth.controller");
module.exports = function(app) {
  app.post("/signup",[verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted],controller.signup );
  app.post("/signin", controller.signin);
  app.post("/verifyOTP",controller.verifyOtp)
};