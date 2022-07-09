const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    availability: {
      type: String,
      enum: ["Rent", "Sale"],
    },
    dimensions: [
      {
        configuration: { type: String },
        area: { type: String },
        floorPlanImg: {
          imgUrl: { type: String },
          publicId: { type: String },
        },
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    docs: {
      brochure: { imgUrl: { type: String }, publicId: { type: String } },
      priceList: { imgUrl: { type: String }, publicId: { type: String } },
      mapImg: { imgUrl: { type: String }, publicId: { type: String } },
    },
    gallery: {
      bannerImg: {
        imgUrl: { type: String },
        publicId: { type: String },
      },
      showcaseImg: [
        {
          imgUrl: { type: String },
          publicId: { type: String },
        },
      ],
    },
    location: {
      address: {
        type: String,
        // required: true,
      },
      city: {
        type: String,
        // required: true,
      },
      street: {
        type: String,
      },
      pincode: {
        type: Number,
        min: 6,
        required: true,
      },
      mapCoordinates: {
        latitude: { type: String },
        longitude: { type: String },
      },
    },
    nearby: [
      {
        type: String,
        enum: [
          "Hospital",
          "Mall",
          "Cafe & Restaurants",
          "Bank & ATM",
          "Shopping Mart",
          "Fire Station",
          "Police Station",
          "Railway",
          "Metro",
          "Bus Station",
          "Banquet Hall",
          "Community Park/Garden",
          "Salon",
          "Airport",
          "Departmental Stores",
          "School",
          "Stationary & Book Store",
          "Medical Store",
          "Food & Vegetable Store",
          "Shops"
        ],
        default: [],
      },
    ],
    buildYear: {
      type: String,
    },
    propertyOverview: {
      type: String,
      enum: ["Under Construction", "Ready To Move"],
    },
    propertyType: {
      type: String,
      enum: [
        "Plot",
        "Shop",
        "Flat",
        "Villa",
        "Project",
        "Bank Morgage",
        "Independent House",
      ],
      required: true,
    },
    amenities: [
      {
        type: String,
        enum: [
          "Air Condition",
          "Heating",
          "Wi-Fi",
          "Microwave",
          "Refrigerator",
          "Smoking Allow",
          "Terrace",
          "Balcony",
          "Parking",
          "Garage",
          "Power Back Up",
          "Security",
          "Lift",
          "Swimming Pool",
          "Gym",
          "Laundry Service",
          "Kids Play Area",
          "Maintenance Staff",
          "Waste Disposal",
          "Squash",
          "Sports Zone",
          "Yoga Center",
          "Cycling Track",
          "Jogging Track",
          "Food Court",
          "Hotel",
          "Party Hall",
          "Furnished interior"
        ],
        default: [],
      },
    ],
    propertyStatus: {
      type: String,
      enum: ["Latest", "Featured", "Upcoming"],
      default: "Latest",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    reraApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;
