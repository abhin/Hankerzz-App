import express from "express";
import {
  create,
  getAllUsers,
  update,
  deleteUser,
  activate,
} from "../controllers/customers.js";
import { validateCreateUser } from "../middlewares/customers.js";

const router = express.Router();

router.post("/signup", validateCreateUser(), create);
router.post("/create", validateCreateUser(), create);

router.get("/read", getAllUsers);
router.put("/update", update);
router.get("/delete/:_id", deleteUser);
router.get("/activate/:token", activate);

export default router;
