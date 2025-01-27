import mongoose from "mongoose";
import { Apierror } from "../utils/Apierror.js";

const errorHandler = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof Apierror)) {
        const statusCode = 
            error.statusCode || 
            (error instanceof mongoose.Error ? 400 : 500);
            
        const message = error.message || "Something went wrong";
        error = new Apierror(statusCode, message, error?.errors || [], err.stack);
    }

    const response = {
        success: false,
        message: error.message,
        errors: error.errors,
        ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {})
    };

    return res.status(error.statusCode).json(response);
};

export { errorHandler };