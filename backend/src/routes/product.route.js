import { Router } from "express"
import {
    createProduct,
    getProduct,
    getAllProducts,
    deleteProduct,
    updateProduct
} from "../controllers/product.controllers.js"

const router = Router()

router.post("/create-product", createProduct)
router.get("/get-product", getProduct)
router.get("/all-products", getAllProducts)
router.patch("/update/:productId", updateProduct)
router.delete("/delete/:productId", deleteProduct)

export default router