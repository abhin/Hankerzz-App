import { body } from "express-validator";
import jwt from "jsonwebtoken";
import Users from "../models/users.js";
import {
  requiredFieldValidation,
  getValidationResult,
  requiredParamValidation,
} from "./validator.js";

export const checkUsersExistence = async (req, res, next) => {
  const { _id } = req.params;
  const { email } = req.body;

  try {
    if (_id) {
      const existingUserById = await Users.exists({ _id });

      if (!existingUserById) {
        return res.status(404).json({
          success: false,
          message: "User does not exist with the provided ID.",
        });
      }
    }

    if (email) {
      const existingUserByEmail = await Users.exists({ email });

      if (existingUserByEmail) {
        return res.status(409).json({
          success: false,
          message: "User already exists with this email.",
        });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while checking user existence.",
      error: error.message,
    });
  }
};

export const validateToken = async (req, res, next) => {
  const { token } = req.params;

  try {
    if (!token) {
      return res.status(401).json({ success: false, message: "Token is missing." });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    req._id = decoded?.uId;

    if (!req._id) {
      return res.status(401).json({ success: false, message: "Invalid token payload." });
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please request a new one.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Authentication failed.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "An error occurred while validating the token.",
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
  checkUsersExistence,
  getValidationResult,
];

export const validateUpdateUser = (id) => [
  requiredFieldValidation("name", 3),
  requiredFieldValidation("email")
    .isEmail()
    .withMessage("Invalid email address format")
    .customSanitizer((value) => value.toLowerCase())
    .custom(async (value, { req }) => {
      const existingUser = await Users.findOne({
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
  checkUsersExistence,
  getValidationResult,
];

export const validateUserActivation = () => [
  requiredParamValidation("token"),
  validateToken,
  async (req, res, next) => {
    try {
      const user = await Users.findById(req._id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      if (user.status) {
        return res.status(400).json({
          success: false,
          message: "Account is already activated.",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error while validating user activation.",
        error: error.message,
      });
    }
  },
  getValidationResult,
];