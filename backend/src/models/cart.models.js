import mongoose, {Schema} from "mongoose";
import { User } from "./user.models.js";

const cartSchema = new Schema(
    {
        products: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            qty: {
                type: Number,
                required: true,
                min: [1, "Quantity cannot be less than 1"],
                default: 1
            },
            price: {
                type: Number,
                required: true
            }
        }],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        // totalAmount: {
        //     type: Number,
        //     required: true,
        //     default: 0
        // },
        status: {
            type: String,
            enum: ["active", "completed", "abandoned"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
)

cartSchema.methods.calculateTotal = function() {
    return this.products.reduce((total, item) => {
        return total + (item.price * item.qty)
    }, 0);
};

cartSchema.pre('save', async function(next) {
    if (this.isModified('status') && this.status === 'completed') {
        const user = await User.findById(this.owner);
        if (user) {
            const cartTotal = this.calculateTotal();
            user.totalOrders += 1;
            user.totalSpent += cartTotal;
            await user.save();
        }
    }
    next();
});

cartSchema.pre('save', async function(next) {
    if (this.isModified('status') && this.status === 'completed') {
        const cartTotal = this.calculateTotal();
        
        await User.findByIdAndUpdate(
            this.owner,
            {
                $inc: {
                    totalOrders: 1,
                    totalSpent: cartTotal
                }
            }
        );

        // Update customer type based on total spending
        const user = await User.findById(this.owner);
        
        if (user.totalSpent >= 1000 && user.totalOrders >= 10) {
            user.customerType = 'vip';
        } else if (user.totalSpent >= 500 && user.totalOrders >= 5) {
            user.customerType = 'regular';
        }
        
        await user.save();
    }
    next();
});

export const Cart = mongoose.model("Cart", cartSchema)