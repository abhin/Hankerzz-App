import mongoose from "mongoose";

const addressesSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    houseNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    streetName: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    county: {
      type: String,
      trim: true,
    },
    postcode: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    country: {
      type: String,
      default: "United Kingdom",
      trim: true,
    },
  },
  { timestamps: true }
);

const addresses = mongoose.model("addresses", addressesSchema);

export default addresses;