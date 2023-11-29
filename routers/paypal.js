import express from "express";
import { capturePayment, createOrder } from "../controllers/paypal.js";

const router = express.Router();
router.post("/create-paypal-order", createOrder);
router.post("/capture-paypal-order", capturePayment);
export default router;
