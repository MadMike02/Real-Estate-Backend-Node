const jwt = require("jsonwebtoken");
const Property = require("../models/property");

/**
 * Check for the token and decode it to find if the user is authenticated
 * @return - decode the user and jump to the next request handler function
 * @error - returns the error
 */
exports.isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.AUTH_TOKEN, (err, decode) => {
      if (err) {
        res.status(401).json({ message: "Invalid Token", status: "error" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: "Unauthorized or no token!", status: "error" });
  }
};

/**
 * Check if the user is the correct owner for the property.
 * If the user is a valid owner only then he/she could update/delete the property
 * @param {id} - gets the ID from the URL to check for the property.
 * @return - jump to the next request handler function
 * @error - return error
 */
exports.isOwner = async (req, res, next) => {
  try {
    if (!req.params.id)
      return res
        .status(401)
        .json({ message: "Invalid request!", status: "error" });

    const findProperty = await Property.findById({ _id: req.params.id }).exec();
    if (!findProperty)
      return res.status(404).json({
        message: "Property not found or won't exist!",
        status: "error",
      });

    if (findProperty.postedBy != req.user.userId)
      return res.status(401).json({
        message: "Sorry! You don't own this property.",
        status: "error",
      });

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message, status: "error" });
  }
};
