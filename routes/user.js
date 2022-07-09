const router = require("express").Router();
const {
  updateProfile,
  updateStatus,
  getUserProfileInfo,
  propertyContact,
  // manageForgetPassword,
} = require("../controllers/user");
const { isAuth } = require("../middlewares/isValid");

// Update a user profile
router.put("/update/my-profile", isAuth, updateProfile);

// Active/Deactive a user profile
router.put("/profile/status", isAuth, updateStatus);

// Get the user profile
router.get("/user/profile", isAuth, getUserProfileInfo);

// Get the user profile
router.get("/property/contact", isAuth, propertyContact);

// Manage Forget password request
//router.post("/forget-password", manageForgetPassword);

module.exports = router;
