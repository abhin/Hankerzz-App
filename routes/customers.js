import express from "express";
import {
  create,
  getAllUsers,
  update,
  deleteUser,
  activate,
} from "../controllers/customers.js";
import {
  validateCreateUser,
  validateUpdateUser,
  validateDeleteUser,
} from "../middlewares/customers.js";

const router = express.Router();

router.post("/signup", validateCreateUser(), create);
router.post("/create", validateCreateUser(), create);

router.get("/read", getAllUsers);

router.put("/update", validateUpdateUser(), update);

router.get(
  "/delete/:_id",
  validateDeleteUser(),
  deleteUser
);

router.get(
  "/activate/:token",
  validateDeleteUser(), 
  activate
);

export default router;
