import { body } from "express-validator";
import Customers from "../models/customers.js";
import { requiredStringValidation, getValidationResult } from "./validator.js";

export async function checkCustomerExists(req, res, next) {
  const { email } = req.body;

  try {
    const existingUser = await Customers.findOne({ email }).lean();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Customer already exists with this email.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while checking if the customer exists.",
      error: error.message,
    });
  }
}

export const validateCreateUser = () => [
  requiredStringValidation("name", 3),
  requiredStringValidation("email")
    .isEmail()
    .withMessage("Invalid email address format")
    .customSanitizer(value => value.toLowerCase()),
  requiredStringValidation("password", 5),
  body("address").optional().trim(),
  checkCustomerExists,
  getValidationResult,
];
