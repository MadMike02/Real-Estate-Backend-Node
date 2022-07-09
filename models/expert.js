const mongoose = require("mongoose");

const expertUserSchema = new mongoose.Schema(
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
    contact: {
      type: String,
      unique: true,
      required: [true, "Contact is Required"],
      trim: true,
    },
    profileImg: {
      imgUrl: { type: String },
      publicId: { type: String },
    },
    experience: {
      type: String,
      trim: true,
      required: true,
    },
    companyName: {
      type: String,
      trim:  true,
      required: true,
    },
    agentType: {
      type: String,
      enum: ['Gold', 'Platinum', 'Bronze'],
      default: 'Bronze',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Expert = mongoose.model("Expert", expertUserSchema);
module.exports = Expert;
