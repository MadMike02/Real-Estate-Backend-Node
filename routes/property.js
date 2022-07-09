const router = require("express").Router();
const { isAuth } = require("../middlewares/isValid");
// const upload = require("../middlewares/multer");
const {
  createNewProperty,
  uploadPropertyImages,
  getLatestProperties,
  getFeaturedProperties,
  getProperty,
  getSearchedProperties,
  bankMorgageProperties,
  projectProperties,
  underConstructionProperties,
  readyToMoveProperties
} = require("../controllers/property");

// get a specific property (by id)
router.get("/property/:id", getProperty);

// get properties based on search query
router.post("/search/property", getSearchedProperties);

// get all Latest properties
router.get("/latest/property", getLatestProperties);

// get all Featured properties
router.get("/featured/property", getFeaturedProperties);

// get all Bank Morgage properties
router.get("/bank-morgage/property", bankMorgageProperties);

// get all Bank Morgage properties
router.get("/project/property", projectProperties);

// get all Properties based on Property Overview
router.get("/readyToMove/property", readyToMoveProperties);

// get all Properties based on Property Overview
router.get("/underConstruction/property", underConstructionProperties);

// list a property
router.post(
  "/list-property",
  isAuth,
  // upload.single("bannerImg"),
  createNewProperty
);

// upload property images (multiple)
router.put(
  "/property-images",
  isAuth,
  // upload.array("showcaseImg", 10),
  uploadPropertyImages
);

module.exports = router;
