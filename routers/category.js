import {
  createCategory,
  deleteCategory,
  getCategory,
} from "../controllers/category.js";
import express from "express";

const router = express.Router();
router.get("/", getCategory);
router.post("/create", createCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
