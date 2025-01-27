import mongoose, {Schema} from "mongoose";

const communicationSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ['support', 'general'],
        required: true
    },
    content: String,
    ticketId: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket'
    }
}, { timestamps: true })


export const Communication = mongoose.model("Communication", communicationSchema)