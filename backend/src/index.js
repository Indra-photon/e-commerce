import { app } from "./app.js";
import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config()

const PORT = process.env.PORT || 3000

connectDB().then(()=>{
    app.listen(PORT, (req,res)=>{
        console.log(`server is running on ${PORT}`);
    })
}).catch((err)=>{
    console.log("MongoDB connection error", err);
    
})

