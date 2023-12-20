import express from "express";
import {
  createOrder,
  getDataOrder,
  getOrderById,
  getOrders,
  getOrdersByUserID,
  payOrder,
} from "../controllers/order.js";

const router = express.Router();
router.get("/", getOrders);
router.post("/my-order", getOrdersByUserID);
router.post("/create", createOrder);
router.post("/details", getOrderById);
router.put("/:id/pay", payOrder);
router.get("/chart", getDataOrder);

export default router;
