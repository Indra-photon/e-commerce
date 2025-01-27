import mongoose, {Schema} from "mongoose";



const paymentSchema = new Schema({
    razorpay_order_id: {
        type: String,
        required: true
    },
    razorpay_payment_id: {
        type: String,
        required: true
    },
    razorpay_signature: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "successful", "failed"],
        default: "pending"
    },
    order: {
        // type: Schema.Types.ObjectId,
        // ref: "Order",
        type: Object,
        required: true
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
}, { timestamps: true });


export const Payment = mongoose.model("Payment", paymentSchema)