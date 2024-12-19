import express from "express";
import {
  create,
  getAllUsers,
  update,
  deleteUser,
  activate,
} from "../controllers/user.js";
import {
  validateCreateUser,
  validateUpdateUser,
  validateDeleteUser,
  validateUserActivation,
} from "../middlewares/user.js";

const router = express.Router();

router.post("/signup", validateCreateUser(), create);
router.get("/read", getAllUsers);
router.put("/update", validateUpdateUser(), update);
router.delete("/delete/:_id", validateDeleteUser(), deleteUser);
router.get("/activate/:token", validateUserActivation(), activate);

export default router;