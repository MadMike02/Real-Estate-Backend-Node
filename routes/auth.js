const router = require("express").Router();
const {
  registerHandler,
  loginHandler,
  userProperties,
  updateProperty,
  deleteProperty,
} = require("../controllers/auth");
const { isAuth, isOwner } = require("../middlewares/isValid");

// User register API
router.post("/register", registerHandler);

// User login API
router.post("/login", loginHandler);

// Get properties added by the agent
router.get("/my-property", isAuth, userProperties);

// Edit/Update a property
router.put("/update/property/:id", isAuth, isOwner, updateProperty);

// Delete a property
router.delete("/delete/property/:id", isAuth, isOwner, deleteProperty);

module.exports = router;
