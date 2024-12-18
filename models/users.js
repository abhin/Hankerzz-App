import mongoose from "mongoose";
import { USER_ROLE_CUSTOMER, USER_ROLE_VENDOR } from "../utilities/constants.js";

const usersSchema = mongoose.Schema(
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
      enum: [USER_ROLE_CUSTOMER, USER_ROLE_VENDOR],
      index: true,
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

const users = mongoose.model("users", usersSchema);

export default users;
