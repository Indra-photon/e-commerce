import { Router } from "express"
import { createRazorpayorder, verifyPayment, getAllOrders, updateOrderStatus } from "../controllers/razorpay.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"

const router = Router()

router.use(verifyJWT)


router.post("/create-order", createRazorpayorder)
router.post("/verify", verifyPayment);
router.get("/all-orders", getAllOrders);
router.patch("/:orderId/status", updateOrderStatus);

export default router