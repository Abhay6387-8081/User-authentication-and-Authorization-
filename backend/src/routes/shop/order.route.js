import { Router } from "express";
import { createOrder,captureOrder, getOrders } from "../../controllers/shop/order.controller.js";

const router = Router();

router.post("/create",createOrder);
router.post("/capture",captureOrder);
router.post("/all",getOrders);

export default router;