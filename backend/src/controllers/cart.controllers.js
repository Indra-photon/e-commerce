import { Apierror } from "../utils/Apierror.js"
import { Apiresponse } from "../utils/Apiresponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Cart } from "../models/cart.models.js"
import { Product } from "../models/product.models.js"

// Add item to cart
const addToCart = asyncHandler(async (req, res) => {
    const { productId, qty = 1 } = req.body;
    console.log(productId);
    

    if (!productId) {
        throw new Apierror(400, "Product ID is required");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new Apierror(404, "Product not found");
    }

    // Find the active cart for the user
    let cart = await Cart.findOne({
        owner: req.user._id,
        status: "active"
    });

    if (!cart) {
        // Create a new cart if none exists
        cart = await Cart.create({
            owner: req.user._id,
            products: [{
                productId: product._id,
                qty,
                price: product.price // Use the price from the Product model
            }]
        });
    } else {
        // Check if the product already exists in the cart
        const existingProduct = cart.products.find(
            item => item.productId.toString() === productId
        );

        if (existingProduct) {
            // Update the quantity if the product exists
            cart = await Cart.findOneAndUpdate(
                {
                    _id: cart._id,
                    "products.productId": productId
                },
                {
                    $inc: {
                        "products.$.qty": qty
                    }
                },
                { new: true }
            );
        } else {
            // Add the product to the cart if it doesn't exist
            cart = await Cart.findByIdAndUpdate(
                cart._id,
                {
                    $push: {
                        products: {
                            productId: product._id,
                            qty,
                            price: product.price // Use the price from the Product model
                        }
                    }
                },
                { new: true }
            );
        }
    }

    return res
        .status(200)
        .json(new Apiresponse(200, cart, "Item added to cart successfully"));
});

// Remove item from cart
const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params

    const cart = await Cart.findOneAndUpdate(
        {
            owner: req.user._id,
            status: "active"
        },
        {
            $pull: {
                products: { productId }
            }
        },
        { new: true }
    )

    if (!cart) {
        throw new Apierror(404, "Cart not found")
    }

    return res
        .status(200)
        .json(new Apiresponse(200, cart, "Item removed from cart successfully"))
})

// Update item quantity
const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const { qty } = req.body

    if (qty < 1) {
        throw new Apierror(400, "Quantity must be at least 1")
    }

    const cart = await Cart.findOneAndUpdate(
        {
            owner: req.user._id,
            status: "active",
            "products.productId": productId
        },
        {
            $set: {
                "products.$.qty": qty
            }
        },
        { new: true }
    )

    if (!cart) {
        throw new Apierror(404, "Cart or product not found")
    }

    return res
        .status(200)
        .json(new Apiresponse(200, cart, "Cart updated successfully"))
})

// Get user's cart
const getUserCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({
        owner: req.user._id,
        status: "active"
    }).populate("products.productId")

    return res
        .status(200)
        .json(new Apiresponse(200, cart, "Cart fetched successfully"))
})

// Clear cart
const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOneAndUpdate(
        {
            owner: req.user._id,
            status: "active"
        },
        {
            $set: {
                products: [],
                status: "abandoned"
            }
        },
        { new: true }
    )

    if (!cart) {
        throw new Apierror(404, "No active cart found")
    }

    return res
        .status(200)
        .json(new Apiresponse(200, cart, "Cart cleared successfully"))
})

// Checkout cart (marks as completed)
const checkoutCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOneAndUpdate(
        {
            owner: req.user._id,
            status: "active"
        },
        {
            $set: {
                status: "completed"
            }
        },
        { new: true }
    )

    if (!cart) {
        throw new Apierror(404, "No active cart found")
    }

    return res
        .status(200)
        .json(new Apiresponse(200, cart, "Cart checked out successfully"))
})

export {
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getUserCart,
    clearCart,
    checkoutCart
}