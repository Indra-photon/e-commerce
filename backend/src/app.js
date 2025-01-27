import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser'

const app = express()

const allowedOrigins = [
    'http://localhost:5173',
    'https://e-commerce-smoky-omega.vercel.app/'
]

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))

// common middleware
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import healthcheckRouter from "./routes/healthcheck.route.js"
import userRouter from "./routes/user.route.js"
import cartRouter  from "./routes/cart.route.js"
import productRouter from "./routes/product.route.js"
import razorpayrouter from './routes/razorpay.route.js'
import { errorHandler } from './middlewares/error.middlewares.js'


app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/carts", cartRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/payment", razorpayrouter)

app.use(errorHandler)

export { app }