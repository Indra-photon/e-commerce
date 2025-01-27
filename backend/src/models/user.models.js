import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from'jsonwebtoken'
const userSchema = new Schema (
    {
       username : {
        type : String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
       },
       email : {
        type : String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
       },
       fullname: {
        type : String,
        required: true,
        trim: false,
        index: true
       },
       address: {
        type : String,
        index: true
       },
       avatar : {
        type : String,
       },
       cartHistory : [
        {
            type: Schema.Types.ObjectId,
            ref: "Cart"
        }
       ],
       password : {
        type : String,
        required : [true, "Password is required"]
       },
       refreshToken : {
        type: String
       },
       forgotPasswordToken: {
        type : String
       },
       forgotPasswordTokenExpiry: {
        type : Date
       },
       verifyToken: {
        type :String
       },
       verifyTokenExpiry: {
        type : Date
       },
       customerStatus: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
        },
        customerType: {
            type: String,
            enum: ['new', 'regular', 'vip'],
            default: 'new'
        },
        lastLoginDate: Date,
        totalOrders: {
            type: Number,
            default: 0
        },
        totalSpent: {
            type: Number,
            default: 0
        },
    },
    {timestamps : true}
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Skip if password isn't modified
    try {
        this.password = await bcrypt.hash(this.password, 10); // Await the hash result
        next(); // Proceed with the save
    } catch (err) {
        next(err); // Pass the error to Mongoose
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function (){
    // accesstokens are short lived tokens
    // jwt.sign({payload}, TOKEN_SECRET, {expiry})
    // payload : when we destructure the token we should receive these payload information
    return jwt.sign({
        _id: this._id,
    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY})
}

userSchema.methods.generateRefreshToken = function (){
    // long lived tokens stored in database
    return jwt.sign({
        _id: this._id,
    }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY})
}



export const User = mongoose.model("User", userSchema)
