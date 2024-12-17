import mongoose from "mongoose";
import { USER_ROLE_CUSTOMER } from "../utilities/constants.js";

const customersSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
      index: true,
      unique: true
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
      enum: [USER_ROLE_CUSTOMER],
      default: USER_ROLE_CUSTOMER,
      index: true,
    },
    address: {
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

const Customers = mongoose.model("Customers", customersSchema);

export default Customers;
