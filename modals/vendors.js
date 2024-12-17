import mongoose from "mongoose";
import { USER_ROLE_VENDOR } from "../utilities/constants";

const vendorsSchema = mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      index: true,
    },
    registrationNo: {
      type: String,
      required: true,
      index: true,
    },
    licenseNo: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
      index: true,
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
      enum: [USER_ROLE_VENDOR],
      default: USER_ROLE_VENDOR,
    },
    companyAddress: {
      type: String,
      required: false,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

const Vendors = mongoose.model("Vendors", vendorsSchema);

export default Vendors;
