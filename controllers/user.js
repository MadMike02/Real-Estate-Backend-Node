const User = require("../models/user");
// const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");

// const transport = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_ID,
//     pass: process.env.EMAIL_PASS,
//   },
// });

/**
 * Request handler to get a user profile details (Already Registered)
 * @returns - the profile details of the currently logged-in user.
 * @error - returns the error message as the response.
 */
exports.getUserProfileInfo = async (req, res) => {
  const { userId } = req.user;
  try {
    const profileInfo = await User.findById({ _id: userId })
      .select("-password")
      .exec();

    if (!profileInfo)
      return res
        .status(404)
        .json({ message: "User not exist!", status: "error" });

    if (profileInfo.isActive === true) {
      res.status(200).json({ data: profileInfo, status: "success" });
    } else {
      res
        .status(401)
        .json({ message: "Profile Deactivated!", status: "error" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};

/**
 * Request handler to update a user profile
 * @body - get the fullname, email, contact, isVerified, verificationType fields from the body.
 * @returns - the new profile details once the profile has been updated successfully.
 * @error - returns the error message as the response.
 */
exports.updateProfile = async (req, res) => {
  const { userId } = req.user;
  const { fullname, email, contact, isVerified, verificationType } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $set: {
          fullname: fullname,
          email: email,
          contact: contact,
          isVerified: isVerified,
        },
        $addToSet: { verificationType: verificationType },
      },
      { new: true }
    ).exec();

    if (!user)
      return res
        .status(404)
        .json({ message: "User not found or don't exist!", status: "error" });

    res.status(201).json({
      message: "Profile update successfully!",
      data: user,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};

/**
 * Request handler to Active/Deactive a user profile status
 * @param {status} - get the status from the URL Query String.
 * @returns - success message once the status has been changed successfully.
 * @error - returns the error message as the responce.
 */
exports.updateStatus = async (req, res) => {
  const { userId } = req.user;
  const { status } = req.query;
  try {
    if (!status)
      return res
        .status(400)
        .json({ message: "Invalid request!", status: "error" });

    const user = await User.findById({ _id: userId }).exec();
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found or don't exist!", status: "error" });

    user.isActive = status;
    await user.save();

    res.status(201).json({
      message: "Status changed successfully!",
      data: user,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};

exports.propertyContact = async (req, res) => {
  const { userId } = req.user;
  const { email, phone, msg, propertyId } = req.body;

  try {
    // Send the contact lead to the admin email
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};

// Manage Forget password request
// exports.manageForgetPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     if (!email)
//       return res
//         .status(400)
//         .json({ message: "Kindly provide an email!", status: "error" });

//     const isUser = await User.findOne({ email }).exec();
//     if (!isUser)
//       return res
//         .status(404)
//         .json({ message: "Emil not exist or is Invalid!", status: "error" });

//     const payload = {
//       email: isUser.email,
//       id: isUser._id,
//     };

//     const requestToken = jwt.sign(
//       payload,
//       process.env.AUTH_TOKEN + isUser.password,
//       { expiresIn: "10m" }
//     );
//     const link = process.env.PASS_RESET_URL + `/${isUser._id}/${requestToken}`;
//     console.log(link);

//     const mailOptions = {
//       from: process.env.EMAIL_ID,
//       to: "9968732560kshitijkumar@gmail.com",
//       subject: "Forget Password Request",
//       text: `Hey! Here's your link to reset your password for NCR Housing. The link is valid for only 10 mins. Kindly click on the link: <a href=${link}>Click Here</a>.
//       Or copy-paste this link to your browser: ${link}`,
//     };

//     transport.sendMail(mailOptions, function (err, info) {
//       if (err) {
//         console.log(err);
//       } else {
//         res.status(200).json({
//           message: "Kindly check your mail to reset your password.",
//           status: "success",
//         });
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message, status: "error" });
//   }
// };
