// const fs = require("fs");
const Property = require("../models/property");
// const cloudinary = require("../middlewares/cloudinary");

/**
 * Request handler to get all properties that are "Ready to Move" and are also "Verified"
 * @return - the list of all the properties that are ready To Move.
 * @error - returns the error message as the response.
 */
exports.readyToMoveProperties = async (req, res) => {
  try {
    const readyToMoveProp = await Property.find({
      propertyOverview: "Ready To Move",
      isVerified: true,
    })
      .select(
        "title dimensions price propertyType availability gallery.bannerImg.imgUrl location reraApproved"
      )
      .sort({ _id: -1 })
      .limit(30)
      .populate("postedBy", "_id fullname email contact role")
      .exec();

    if (readyToMoveProp.length == 0)
      res
        .status(404)
        .json({ message: "No Properties Exists!", status: "error" });

    res.status(200).json({ data: readyToMoveProp, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};

/**
 * Request handler to get all properties that are "Under Construction" and are also "Verified"
 * @return - the list of all the properties that are Under Construction.
 * @error - returns the error message as the response.
 */
exports.underConstructionProperties = async (req, res) => {
  try {
    const underConstructionProp = await Property.find({
      propertyOverview: "Under Construction",
      isVerified: true,
    })
      .select(
        "title dimensions price propertyType availability gallery.bannerImg.imgUrl location reraApproved"
      )
      .sort({ _id: -1 })
      .limit(30)
      .populate("postedBy", "_id fullname email contact role")
      .exec();

    if (underConstructionProp.length == 0)
      res
        .status(404)
        .json({ message: "No Properties Exists!", status: "error" });

    res.status(200).json({ data: underConstructionProp, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};

/**
 * Request handler to get a specific Property based on the Id provided in the URL.
 * @param {id} - gets the property ID from the URL.
 * @returns - the complete property details.
 * @error - returns the error message as the response.
 */
exports.getProperty = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id)
      return res
        .status(401)
        .json({ message: "Invalid request!", status: "error" });

    const property = await Property.findById({ _id: id })
      .populate("postedBy", "_id fullname email contact role")
      .exec();
    if (!property)
      return res
        .status(404)
        .json({ message: "Property not found!", status: "error" });

    res.status(200).json({ data: property, status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};

/**
 * Request handler to get properties based on search query
 * @returns - list of the properties found on the basis of search query
 * @error - returns the error message as the response
 */
exports.getSearchedProperties = async (req, res) => {
  // For availability filter (Rent/Sale)
  const availabilityFilter =
    req.body.availability && req.body.availability !== ""
      ? { availability: req.body.availability }
      : {};
  
  // For location Filter
  const locationFilter =
    req.body.city && req.body.city !== ""
      ? {
          "location.address": {
            $regex: req.body.city,
            $options: "i",
          },
        }
      : {};
  
  // For property type filter (Plot/Shop/Flat etc...)
  const propertyTypeFilter =
    req.body.propertyType && req.body.propertyType !== ""
      ? { propertyType: req.body.propertyType }
      : {};

  // For BHK Filter
  const dimensionsConfigFilter =
    req.body.dimensions && req.body.dimensions !== ""
      ? {
          dimensions: {
            configuration: req.body.dimensions,
          },
        }
      : {};

  // For Price Filter
  const priceFilter =
    req.body.price && req.body.priceFilter !== ""
      ? {
          price: {
            $gte: Number(req.body.price.split("-")[0]),
            $lte: Number(req.body.price.split("-")[1]),
          },
        }
      : {};

  // For RERA Filter
  const reraFilter =
    req.body.rera && req.body.rera !== null
      ? { reraApproved: req.body.rera }
      : {};

  // Property Verificaton Filter
  const propertyVerifyFilter = { isVerified: true };

  try {
    const result = await Property.find({
      ...availabilityFilter,
      ...propertyTypeFilter,
      ...dimensionsConfigFilter,
      ...locationFilter,
      ...priceFilter,
      ...reraFilter,
      ...propertyVerifyFilter,
    })
      .select(
        "title dimensions price propertyType availability gallery.bannerImg.imgUrl location reraApproved"
      )
      .limit(30)
      .sort({ _id: -1 })
      .populate("postedBy", "_id fullname email contact role")
      .exec();

    if (result.length === 0)
      return res.status(404).json({
        message:
          "Sorry! We currently don't have any properties matching the criteria",
        status: "error",
      });

    res.status(200).json({ data: result, status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};

/**
 * Request handler to get all properties that are marked as "Latest" and are also "Verified"
 * @return - the list of all the latest properties.
 * @error - returns the error message as the response.
 */
exports.getLatestProperties = async (req, res) => {
  try {
    let properties = await Property.find({
      propertyStatus: "Latest",
      isVerified: true,
    })
      .select(
        "title dimensions price propertyType availability gallery.bannerImg.imgUrl location reraApproved"
      )
      .sort({ _id: -1 })
      .limit(30)
      .populate("postedBy", "_id fullname email contact role")
      .exec();

    if (properties.length !== 0) {
      res.status(200).json({ data: properties, status: "success" });
    } else {
      res
        .status(404)
        .json({ message: "No properties found!", status: "error" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};

/**
 * Request handler to get all properties that are marked as "Featured" and are also "Verified"
 * @return - the list of all the featured properties.
 * @error - returns the error message as the response.
 */
exports.getFeaturedProperties = async (req, res) => {
  try {
    let featured = await Property.find({
      propertyStatus: "Featured",
      isVerified: true,
    })
      .select(
        "title dimensions price propertyType availability gallery.bannerImg.imgUrl gallery.showcaseImg location reraApproved"
      )
      .sort({ _id: -1 })
      .limit(8)
      .populate("postedBy", "_id fullname email contact role")
      .exec();

    if (featured.length !== 0) {
      res.status(200).json({ data: featured, status: "success" });
    } else {
      res
        .status(404)
        .json({ message: "No featured property exists!", status: "error" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};

/**
 * Request handler to get all Bank Morgage properties that are marked as "Verified"
 * @return - the list of all the Bank Morgage properties.
 * @error - returns the error message as the response.
 */
exports.bankMorgageProperties = async (req, res) => {
  try {
    let bmp = await Property.find({
      propertyType: "Bank Morgage",
      isVerified: true,
    })
      .select(
        "title dimensions price propertyType availability gallery.bannerImg.imgUrl location reraApproved"
      )
      .sort({ _id: -1 })
      .limit(25)
      .populate("postedBy", "_id fullname email contact role")
      .exec();

    if (bmp.length !== 0) {
      res.status(200).json({ data: bmp, status: "success" });
    } else {
      res
        .status(404)
        .json({ message: "No Bank Morgage property exists!", status: "error" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};

/**
 * Request Handler to get all the Projects (Properties) that are marked as "Verified"
 * @return - all the project properties
 * @error - returns the error message as the response.
 */
exports.projectProperties = async (req, res) => {
  try {
    const pp = await Property.find({
      propertyType: "Project",
      isVerified: true,
    })
      .select(
        "title dimensions price propertyType availability gallery.bannerImg.imgUrl location reraApproved"
      )
      .sort({ _id: -1 })
      .limit(25)
      .populate("postedBy", "_id fullname email contact role")
      .exec();

    if (pp.length !== 0) {
      res.status(200).json({ data: pp, status: "success" });
    } else {
      res.status(404).json({ message: "No Projects exists", status: "error" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};

/**
 * Request handler to List/Create a new property
 * @return - newly added property
 * @error - returns the error message as the response.
 */
exports.createNewProperty = async (req, res) => {
  const { userId, verificationStatus } = req.user;
  const {
    title,
    summary,
    availability,
    dimensions,
    price,
    buildYear,
    propertyOverview,
    propertyType,
    address,
    city,
    street,
    pincode,
    latitude,
    longitude,
    bannerImg,
    nearby,
    amenities,
    brochure,
    priceList,
    mapImg,
    reraApproved,
  } = req.body;

  // const uploader = async (path) =>
  //   await cloudinary.uploads(path, "PropertyImages");

  // if (req.file && req.file.path) {
  // const newPath = await uploader(req.file.path);
  // const imgInfo = { imgUrl: newPath.url, publicId: newPath.id };
  // fs.unlinkSync(req.file.path);
  try {
    const newProperty = new Property({
      title,
      summary,
      postedBy: userId,
      dimensions,
      price,
      availability,
      buildYear,
      propertyOverview,
      propertyType,
      location: {
        address,
        city,
        street,
        pincode,
        mapCoordinates: {
          latitude,
          longitude,
        },
      },
      nearby,
      amenities,
      docs: {
        brochure,
        priceList,
        mapImg,
      },
      reraApproved,
    });
    newProperty.gallery.bannerImg = bannerImg;
    newProperty.isVerified = verificationStatus ? true : false;

    await newProperty.save();
    res.status(201).json({
      message: "Property listed successfully!",
      data: newProperty,
      status: "success",
    });
    // } else {
    //   res
    //     .status(405)
    //     .json({ message: "Error uploading file!", status: "error" });
    // }
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};

/**
 * Request handler to add the images for the property
 * @returns - success message aling with the property details
 * @error - returns the error message as the response.
 */
exports.uploadPropertyImages = async (req, res) => {
  const { propertyId, showcaseImg } = req.body;

  try {
    // const uploader = async (path) =>
    //   await cloudinary.uploads(path, "PropertyImages");

    const property = await Property.findOne({ _id: propertyId }).exec();
    if (!property)
      return res
        .status(404)
        .json({ message: "Property not found!", status: "error" });

    // if (req.files) {
    // const showcaseImgUrl = [];
    // const files = req.files;

    // for (const file of files) {
    //   const { path } = file;
    //   const newPath = await uploader(path);
    //   showcaseImgUrl.push({ imgUrl: newPath.url, publicId: newPath.id });
    //   fs.unlinkSync(path);
    // }

    property.gallery.showcaseImg = showcaseImg;
    await property.save();

    res.status(201).json({
      message: "Images uploaded successfully",
      data: property,
      status: "success",
    });
    // }
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};
