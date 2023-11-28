import express from "express";
import { loginUser, registerUser, getUserById } from "../controllers/user.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/getUserByID/", getUserById);

export default router;
