import { body } from "express-validator";
import jwt from "jsonwebtoken";
import Customers from "../modals/customers.js";
import {
  requiredFieldValidation,
  getValidationResult,
  requiredParamValidation,
} from "./validator.js";

export const checkCustomerExistence = async (req, res, next) => {
  const { _id } = req.params;
  const { email } = req.body;

  try {
    if (_id) {
      const existingUserById = await Customers.exists({ _id });

      if (!existingUserById) {
        return res.status(404).json({
          success: false,
          message: "Customer does not exist with the provided ID.",
        });
      }
    }

    if (email) {
      const existingUserByEmail = await Customers.exists({ email });

      if (existingUserByEmail) {
        return res.status(409).json({
          success: false,
          message: "Customer already exists with this email.",
        });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while checking customer existence.",
      error: error.message,
    });
  }
};

const validateToken = async (req, res, next) => {
  const { token } = req.params;
  try {
    if (!token) throw new Error("Unauthorized access.");

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const userId = decoded?.uId;

    if (!userId) throw new Error("Invalid token.");

    const customer = await Customers.exists({ _id: userId });

    if (!customer) throw new Error("Customer not found.");

    if (customer.status) {
      return res.status(400).json({
        success: false,
        message: "Account already activated.",
      });
    }

    req.userId = userId;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while verifying token.",
      error: error.message,
    });
  }
};

export const validateCreateUser = () => [
  requiredFieldValidation("name", 3),
  requiredFieldValidation("email")
    .isEmail()
    .withMessage("Invalid email address format")
    .customSanitizer((value) => value.toLowerCase()),
  requiredFieldValidation("password", 5),
  body("address").optional().trim(),
  checkCustomerExistence,
  getValidationResult,
];

export const validateUpdateUser = (id) => [
  requiredFieldValidation("name", 3),
  requiredFieldValidation("email")
    .isEmail()
    .withMessage("Invalid email address format")
    .customSanitizer((value) => value.toLowerCase())
    .custom(async (value, { req }) => {
      const existingUser = await Customers.findOne({
        email: value,
        _id: { $ne: id },
      });
      if (existingUser) {
        throw new Error("Email is already in use.");
      }
      return true;
    }),
  body("password")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
  getValidationResult,
];

export const validateDeleteUser = () => [
  requiredParamValidation("_id").isMongoId().withMessage("Invalid ID."),
  checkCustomerExistence,
  getValidationResult,
];

export const validateUserActivation = () => [
  requiredParamValidation("token"),
  validateToken,
  getValidationResult,
];
