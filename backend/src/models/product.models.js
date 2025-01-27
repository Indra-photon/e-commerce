import mongoose, {Schema} from "mongoose";

const productSchema = new Schema (
    {
       name : {
        type : String,
        required: true,
        index: true
       },
       description : {
        type : String,
        required : true,
        index: true
       },
       price : {
        type : Number,
        required: true
       },
       discount : {
        type : String,
        required : true
       },
       tag : {
        type : String,
        required : true
       },
       image : {
        type : String,
        required : true
       },
    },
    {timestamps : true}
)

export const Product = mongoose.model("Product", productSchema)