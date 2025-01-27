import Razorpay from "razorpay"
import { Apierror } from "../utils/Apierror.js"
import { Apiresponse } from "../utils/Apiresponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {Payment} from "../models/payment.models.js"
import { User } from "../models/user.models.js"
import { Cart } from "../models/cart.models.js"
import crypto from 'crypto'
import mongoose from "mongoose"

const instance = new Razorpay({ 
    key_id: process.env.YOUR_KEY_ID, 
    key_secret: process.env.YOUR_SECRET
})

const createRazorpayorder = asyncHandler ( async (req,res) => {
    const {cartItems, totalAmount} = req.body

    if (!totalAmount || totalAmount <= 0) {
        throw new Apierror(400, "Invalid order amount")
    }

    
    try {
        const order = await instance.orders.create({
            amount: totalAmount*100,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                key1: "value3",
                key2: "value2"
            }
        })

        if (!order || !order.id) {
            throw new Apierror(500, "Failed to create Razorpay order")
        }

        // console.log(order);  successfully working
        

        return res
            .status(200)
            .json(new Apiresponse(200, order, "Order created successfully"))

    } catch (error) {
        console.log(error);
        throw new Apierror(500, "Something went wrong while creating the order")
        
    }
})

const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartItems } = req.body;
    const user = req.user._id;
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.YOUR_SECRET)
            .update(body.toString())
            .digest("hex");
            
        const isAuthentic = expectedSignature === razorpay_signature;
        
        
        if (isAuthentic) {
            // Calculate total amount from cart items
            const orderTotal = cartItems.reduce((total, item) => {
                return total + (item.price * item.qty);
            }, 0);

            // Create payment record
            await Payment.create([{
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                status: "successful",
                order: cartItems,
                owner: user
            }], { session });

            // Update cart status
            await Cart.findOneAndUpdate(
                { owner: user, status: "active" },
                { status: "completed" },
                { session }
            );

            // Update user's totalSpent and totalOrders
            await User.findByIdAndUpdate(
                user,
                {
                    $inc: { 
                        totalSpent: orderTotal,
                        totalOrders: 1
                    }
                },
                { session }
            );

            await session.commitTransaction();
            return res.status(200).json(
                new Apiresponse(200, {}, "Payment verified successfully")
            );
        }
        
        throw new Apierror(400, "Payment verification failed");
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

// orderController.js
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Payment.find()
        .populate('owner')
        .sort('-createdAt');

    return res.status(200).json(
        new Apiresponse(200, orders, "Orders fetched successfully")
    );
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Payment.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
    );

    return res.status(200).json(
        new Apiresponse(200, order, "Order status updated successfully")
    );
});

export {
    createRazorpayorder,
    verifyPayment,
    getAllOrders,
    updateOrderStatus,
}