import { Router } from "express"
import {
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getUserCart,
    clearCart,
    checkoutCart
} from "../controllers/cart.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"

const router = Router()

router.use(verifyJWT) // Protect all cart routes

router.post("/addCart", addToCart)
router.get("/getuserCart", getUserCart)
router.delete("/clear", clearCart)
router.post("/checkout", checkoutCart)
router.delete("/product/:productId", removeFromCart)
router.patch("/product/:productId", updateCartItemQuantity)

export default router