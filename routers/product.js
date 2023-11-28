import {
  createProduct,
  deleteProduct,
  findProduct,
  getProductById,
  getProducts,
} from "../controllers/product.js";

import express from "express";

const router = express.Router();
router.get("/", getProducts);
router.post("/details", getProductById);
router.post("/create", createProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/search/", findProduct);

export default router;
