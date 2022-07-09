const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Property = require("../models/property");
const cloudinary = require("../middlewares/cloudinary");

/**
 * Get all the properties listed by the agent/dealer
 * @returns - all the properties added by the agent
 * @error - returns the error as the response
 */
exports.userProperties = async (req, res) => {
  const { userId } = req.user;

  try {
    const userProperty = await Property.find({ postedBy: userId })
      .select(
        "title dimensions price availability gallery.bannerImg.imgUrl location isVerified"
      )
      .populate("postedBy", "_id fullname email role contact")
      .exec();

    if (!userProperty)
      return res.status(404).json({
        message: "You haven't posted any properties",
        status: "error",
      });

    res.status(200).json({ data: userProperty, status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};

/**
 * Handler to Update any Property based on the Property ID received in the URL
 * @param {id} - get the ID as parameter from the URL.
 * @returns - the updated property details as response.
 * @error - returns the error as response.
 */
exports.updateProperty = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    summary,
    availability,
    dimensions,
    docs,
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
    nearby,
    amenities,
    reraApproved,
  } = req.body;

  try {
    const propertyToUpdate = await Property.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          title: title,
          summary: summary,
          availability: availability,
          docs: docs,
          price: price,
          buildYear: buildYear,
          propertyOverview: propertyOverview,
          propertyType: propertyType,
          "location.address": address,
          "location.city": city,
          "location.street": street,
          "location.pincode": pincode,
          "location.mapCoordinates.latitude": latitude,
          "location.mapCoordinates.longitude": longitude,
          "reraApproved": reraApproved,
        },
        $addToSet: { dimensions: dimensions },
        $addToSet: { amenities: amenities },
        $addToSet: { nearby: nearby },
      },
      { new: true, multi: false }
    );

    if (!propertyToUpdate)
      return res
        .status(404)
        .json({ message: "Property not exist or not found!", status: "error" });

    res.status(201).json({
      message: "Property updated successfully!",
      data: propertyToUpdate,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};

/**
 * Delete a Property
 * @param {id} - get the ID as parameter from the URL.
 * @returns - success message after the property is successfully deleted.
 * @error - returns the error as response
 */
exports.deleteProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const removeImg = async (publicId) => await cloudinary.delete(publicId);

    const propertyToDel = await Property.findById({ _id: id }).exec();
    if (!propertyToDel)
      return res.status(404).json({
        message: "Property not found or don't exist",
        status: "error",
      });

    await removeImg(propertyToDel.gallery.bannerImg.publicId);
    await removeImg(propertyToDel.docs.brochure.publicId);
    await removeImg(propertyToDel.docs.priceList.publicId);
    await removeImg(propertyToDel.docs.mapImg.publicId);

    for (const file of propertyToDel.gallery.showcaseImg) {
      await removeImg(file.publicId);
    }

    for (const floor of propertyToDel.dimensions) {
      await removeImg(floor.floorPlanImg.publicId);
    }

    await propertyToDel.deleteOne();
    res.status(200).json({ message: "Property deleted!", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};

/**
 * Request Handler to validate and register a user
 * @returns - success message if the account gets created successfully.
 * @error - returns the error message as response.
 */
exports.registerHandler = async (req, res) => {
  const { fullname, email, password, contact, role } = req.body;
  const emailRegEx =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  try {
    if (!fullname || fullname === "")
      return res
        .status(400)
        .json({ message: "Name is required", status: "error" });
    if (fullname.length < 3)
      return res
        .status(400)
        .json({ message: "Kindly provide a valid Name", status: "error" });
    if (!email || email === "")
      return res
        .status(400)
        .json({ message: "Email is required", status: "error" });
    if (!emailRegEx.test(email))
      return res.status(400).json({
        message: "Invalid email found. Kindly provide a valid email!",
        status: "error",
      });
    if (!password || password === "")
      return res
        .status(400)
        .json({ message: "Password is required", status: "error" });
    if (password.length < 6)
      return res.status(400).json({
        message: "Password must be atleast 6 characters long",
        status: "error",
      });
    if (!contact || contact === "")
      return res
        .status(400)
        .json({ message: "Contact is required", status: "error" });
    if (contact.length !== 10)
      return res.status(400).json({
        message: "Kindly provide a valid contact number",
        status: "error",
      });

    let emailExist = await User.findOne({ email }).exec();
    let phoneExist = await User.findOne({ contact }).exec();
    if (emailExist || phoneExist)
      return res.status(400).json({
        message: "Either Email or Contact Number already exists",
        status: "error",
      });
    // if (phoneExist) return res.status(400).json({ message: 'Contact Number already exists', status: 'error' });

    const user = new User({
      fullname,
      email,
      password,
      contact,
      role,
    });

    await user.save();
    return res
      .status(201)
      .json({ message: "Account Created", status: "success" });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong. Please try again!",
      status: "error",
    });
  }
};

/**
 * Request handler to validate and login a user
 * @returns - Auth Token and the current logged-in user details.
 * @error - returns the error message as response.
 */
exports.loginHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email)
      return res
        .status(400)
        .json({ message: "Kindly provide an Email", status: "error" });
    if (!password)
      return res
        .status(400)
        .json({ message: "Kindly provide a Password", status: "error" });

    const checkUser = await User.findOne({ email }).exec();
    if (!checkUser)
      return res.status(401).json({
        message: "Invalid Credentials. Kindly provide correct details!!",
        status: "error",
      });

    // Verify Password
    checkUser.comparePass(password, (err, match) => {
      if (!match || err)
        return res.status(401).json({
          message: "Invalid Credentials. Kindly provide correct details!!",
          status: "error",
        });

      const token = jwt.sign(
        { userId: checkUser._id, verificationStatus: checkUser.isVerified },
        process.env.AUTH_TOKEN,
        { expiresIn: "2h" }
      );

      return res.status(200).json({
        message: "Login Success",
        status: "success",
        token: token,
        userData: {
          userid: checkUser._id,
          username: checkUser.fullname,
          userEmail: checkUser.email,
          userContact: checkUser.contact,
          userRole: checkUser.role,
          userStatus: checkUser.isActive,
          verificationStatus: checkUser.isVerified,
          verificationType: checkUser.verificationType,
        },
      });
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Signin failed. Please try again!", status: "error" });
  }
};
