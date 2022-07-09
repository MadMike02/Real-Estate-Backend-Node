const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Name is Required"],
      minLength: 3,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is Required"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
      trim: true,
      min: 6,
      max: 30,
    },
    contact: {
      type: String,
      unique: true,
      required: [true, "Contact is Required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "agent", "broker", "customer", "consultant", "dealer"],
      default: "customer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationType: [
      {
        type: String,
        enum: ["Email", "Phone"],
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hashing Password
userSchema.pre("save", function (next) {
  let user = this;
  if (user.isModified("password")) {
    return bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) {
        // console.log('Error' + err);
        return next(err);
      }
      user.password = hash;
      return next();
    });
  } else {
    return next();
  }
});

// Compare Passwords
userSchema.methods.comparePass = function (password, next) {
  bcrypt.compare(password, this.password, function (err, match) {
    if (err) {
      return next(err, false);
    }
    return next(null, match);
  });
};

const User = mongoose.model("User", userSchema);
module.exports = User;
