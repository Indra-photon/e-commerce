import mongoose, {Schema} from "mongoose";

const ticketSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved', 'closed'],
        default: 'open'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    category: {
        type: String,
        enum: ['order', 'product', 'payment', 'other'],
        required: true
    },
    messages: [{
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true })

export const Ticket = mongoose.model("Ticket", ticketSchema)