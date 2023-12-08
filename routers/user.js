import express from "express";
import {
  loginUser,
  registerUser,
  getUserById,
  getUsers,
  updateProfile,
} from "../controllers/user.js";
const router = express.Router();

router.get("/", getUsers);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/getUserByID/", getUserById);
router.put("/profile/", updateProfile);

export default router;
