import express from "express";
import {
  createOrder,
  getOrderById,
  getOrders,
  payOrder,
} from "../controllers/order.js";

const router = express.Router();
router.get("/", getOrders);
router.post("/create", createOrder);
router.post("/details", getOrderById);
router.put("/:id/pay", payOrder);

export default router;