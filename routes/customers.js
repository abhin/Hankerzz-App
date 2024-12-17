import express from "express";
import {
  create,
  getAllUsers,
  update,
  deleteUser,
  activate,
} from "../controllers/customers.js";
import { body } from "express-validator";
import { getValidationResult } from "../middlewares/validator.js";


const router = express.Router();

router.post(
  "/signup",
  body("name")
    .exists()
    .trim()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Name should be Minimum 3 characters"),
  body("email").exists().trim().isEmail().withMessage("Invalid Email"),
  body("password")
    .trim()
    .exists()
    .isLength({ min: 5 })
    .withMessage("Password should be Minimum 5 characters"),
  getValidationResult,
  create
);

router.post(
  "/create",
  body("name")
    .exists()
    .trim()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Name should be Minimum 3 characters"),
  body("email").exists().trim().isEmail().withMessage("Invalid Email"),
  body("password")
    .trim()
    .exists()
    .isLength({ min: 5 })
    .withMessage("Password should be Minimum 5 characters"),
  getValidationResult,
  create
);

router.get("/read", getAllUsers);
router.put("/update", update);
router.get("/delete/:_id", deleteUser);
router.get("/activate/:token", activate);

export default router;
