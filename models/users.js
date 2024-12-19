import mongoose from "mongoose";
import { USER_ROLE_CUSTOMER, USER_ROLE_VENDOR } from "./userRoles.js";

const usersSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
      index: true,
    },
    password: { type: String, required: false },
    roleId: {
      type: Number,
      required: true,
      enum: [USER_ROLE_CUSTOMER.id, USER_ROLE_VENDOR.id],
      index: true,
    },
    status: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", usersSchema);

export default Users;
