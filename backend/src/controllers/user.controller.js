import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/Apierror.js"
import { Apiresponse } from "../utils/Apiresponse.js"
import { User} from "../models/user.models.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendEmail } from "../utils/nodemailer.js";
import bcrypt from "bcrypt"
import { Cart } from "../models/cart.models.js";
import { Payment } from "../models/payment.models.js";



const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new Apierror(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullname, email, username, password } = req.body
    // console.log("email: ", email);

    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new Apierror(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    
    
    if (existedUser) {
        throw new Apierror(409, "User with email or username already exists")
    }
    //console.log(req.files);

    // const avatarLocalPath = req.files?.avatar[0]?.path;
    // //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path
    // }
    

    // if (!avatarLocalPath) {
    //     throw new Apierror(400, "Avatar file is required")
    // }

    // const avatar = await uploadOnCloudinary(avatarLocalPath)
    // const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // if (!avatar) {
    //     throw new Apierror(400, "Avatar file is required")
    // }
   

    const user = await User.create({
        fullname,
        // avatar: avatar?.url || "",
        // coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password"
    )

    if (!createdUser) {
        throw new Apierror(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new Apiresponse(200, createdUser, "User registered Successfully")
    )

} )

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    // console.log(email);
    // console.log('Login request body:', req.body);
    // console.log('Login request headers:', req.headers);

    if (!username && !email) {
        throw new Apierror(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new Apierror(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new Apierror(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new Apierror(401, "Invalid user credentials")
    }

    // Update lastLoginDate
    user.lastLoginDate = new Date()
    await user.save({ validateBeforeSave: false })

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new Apiresponse(
            200, 
            {
                user: loggedInUser
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new Apiresponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new Apierror(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new Apierror(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new Apierror(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new Apiresponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new Apierror(401, error?.message || "Invalid refresh token")
    }

})

// Step 1: Request password reset
const requestPasswordReset = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new Apierror(400, "Email is required");
    }

    // Find user and validate
    const user = await User.findOne({ email: email.toLowerCase() }); // Add lowercase for consistency
    if (!user) {
        // Security: Still send success response even if email doesn't exist
        return res.status(200).json(
            new Apiresponse(200, {}, "If your email is registered, you will receive a reset link")
        );
    }

    try {
        await sendEmail({
            email: user.email,
            emailType: "RESET",
            userId: user._id
        });

        return res.status(200).json(
            new Apiresponse(200, {}, "Password reset link sent successfully")
        );
    } catch (error) {
        console.log(error);
        
        throw new Apierror(500, "Error sending reset email. Please try again.");
    }
});

const resetForgotPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;
    // console.log("Received token:", token);

    if (!token || !newPassword) {
        throw new Apierror(400, "All fields are required");
    }

    // Find all users with non-expired tokens
    const users = await User.find({
        forgotPasswordTokenExpiry: { $gt: Date.now() }
    });
    // console.log(users);
    

    // Find the user whose hashed token matches
    let userFound = null;
    for (const user of users) {
        // console.log(user.forgotPasswordToken);
        
        const isValidToken = bcrypt.compare(token, user.forgotPasswordToken);
        if (isValidToken) {
            userFound = user;
            break;
        }
    }

    if (!userFound) {
        throw new Apierror(400, "Invalid or expired reset token");
    }

    // Update user's password
    userFound.password = newPassword;
    userFound.forgotPasswordToken = undefined;
    userFound.forgotPasswordTokenExpiry = undefined;

    await userFound.save();

    return res.status(200).json(
        new Apiresponse(200, {}, "Password reset successful")
    );
});

const getCurrentUser = asyncHandler(async(req, res) => {
    
    return res
    .status(200)
    .json(new Apiresponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

// const getCurrentUser = asyncHandler(async(req, res) => {
//     try {
//         // Check if user exists in request
//         if (!req.user) {
//             console.error("User not found in request");
//             return res.status(401).json(
//                 new Apiresponse(401, null, "User not found")
//             );
//         }

//         // Log successful request
//         console.log("User fetched:", req.user._id);
        
//         return res.status(200).json(
//             new Apiresponse(
//                 200,
//                 req.user,
//                 "User fetched successfully"
//             )
//         );
//     } catch (error) {
//         console.error("Error in getCurrentUser:", error);
//         return res.status(500).json(
//             new Apierror(
//                 500,
//                 error.message || "Error fetching dashboard stats"
//             )
//         );
//     }
// });

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {username, email, fullname, address} = req.body

    if (!fullname || !email || !address) {
        throw new Apierror(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                username: username,
                email: email,
                fullname: fullname,
                address: address
            }
        },
        {new: true}
        
    ).select("-password")

    return res
        .status(200)
        .json(new Apiresponse(200, user, "Account details updated successfully"))
});

// const updateUserAvatar = asyncHandler(async(req, res) => {
//     const avatarLocalPath = req.file?.path
//     console.log(avatarLocalPath);
    

//     if (!avatarLocalPath) {
//         throw new Apierror(400, "Avatar file is missing")
//     }

//     //TODO: delete old image - assignment

//     const avatar = await uploadOnCloudinary(avatarLocalPath)
//     console.log(avatar.url);
    

//     if (!avatar.url) {
//         throw new Apierror(400, "Error while uploading on avatar")
        
//     }

//     const user = await User.findByIdAndUpdate(
//         req.user?._id,
//         {
//             $set:{
//                 avatar: avatar.url
//             }
//         },
//         {new: true}
//     ).select("-password")

//     return res
//     .status(200)
//     .json(
//         new Apiresponse(200, user, "Avatar image updated successfully")
//     )
// })

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path  // This will now work with upload.single()
    
    if (!avatarLocalPath) {
        throw new Apierror(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    
    if (!avatar?.url) {
        throw new Apierror(400, "Error while uploading avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new Apiresponse(200, user, "Avatar image updated successfully")
    )
})

const updateCart = asyncHandler(async(req, res) => {
    // Get cart items from request body
    const { cartItems } = req.body

    // Find user and update cart history by pushing new cart items
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $push: {
                cartHistory: cartItems // Push new cart items to the array
            }
        },
        {
            new: true    // Return updated document
        }
    ).select("-password")

    if (!user) {
        throw new Apierror(404, "User not found")
    }

    return res
    .status(200)
    .json(
        new Apiresponse(
            200, 
            user, 
            "Cart history updated successfully"
        )
    )
})

const getCustomerAnalytics = asyncHandler(async (req, res) => {
    const userId = req.params.userId

    const user = await User.findById(userId)
        .populate({
            path: 'cartHistory',
            match: { status: 'completed' } // Only completed carts
        })

    if (!user) {
        throw new Apierror(404, "User not found")
    }

    // Calculate analytics
    const analytics = {
        customerInfo: {
            id: user._id,
            username: user.username,
            email: user.email,
            customerType: user.customerType,
            customerStatus: user.customerStatus,
            lastLoginDate: user.lastLoginDate,
        },
        orderStats: {
            totalOrders: user.totalOrders,
            totalSpent: user.totalSpent,
            cartHistory: user.cartHistory
        },
        accountInfo: {
            registeredOn: user.createdAt,
            lastUpdated: user.updatedAt
        }
    }

    return res.status(200).json(
        new Apiresponse(200, analytics, "Customer analytics retrieved successfully")
    )
})

const updateCustomerStatus = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const { customerStatus, customerType } = req.body

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                customerStatus,
                customerType
            }
        },
        { new: true }
    ).select("-password -refreshToken")

    if (!user) {
        throw new Apierror(404, "User not found")
    }

    return res.status(200).json(
        new Apiresponse(200, user, "Customer status updated successfully")
    )
})

// Get all customers with filters
const getAllCustomers = asyncHandler(async (req, res) => {
    const {
        customerType,
        customerStatus,
        sort = "createdAt",
        page = 1,
        limit = 10
    } = req.query

    const filter = {}

    if (customerType) filter.customerType = customerType
    if (customerStatus) filter.customerStatus = customerStatus

    const customers = await User.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-password -refreshToken")

    const totalCustomers = await User.countDocuments(filter)

    return res.status(200).json(
        new Apiresponse(200, {
            customers,
            totalCustomers,
            currentPage: page,
            totalPages: Math.ceil(totalCustomers / limit)
        }, "Customers fetched successfully")
    )
})

const getDashboardStats = asyncHandler(async (req, res) => {
    try {
        // Get current date and dates for different time ranges
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
        
        // console.log("Starting to fetch dashboard stats...");

        // 1. Basic User Statistics
        const totalCustomers = await User.countDocuments();
        const newCustomers = await User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        // 2. Sales and Revenue Metrics
        const salesData = await Payment.aggregate([
            {
                $match: {
                    status: "successful",
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $unwind: "$order"
            },
            {
                $group: {
                    _id: null,
                    totalSales: {
                        $sum: { $multiply: ["$order.qty", "$order.price"] }
                    },
                    totalOrders: { $sum: 1 },
                    totalItems: { $sum: "$order.qty" }
                }
            }
        ]);

        const totalSales = salesData[0]?.totalSales || 0;
        const totalOrders = salesData[0]?.totalOrders || 0;
        const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

        // 3. Monthly Revenue Data
        const monthlyRevenue = await Payment.aggregate([
            {
                $match: {
                    status: "successful",
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $unwind: "$order"
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    revenue: {
                        $sum: { $multiply: ["$order.qty", "$order.price"] }
                    },
                    orders: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // 4. Customer Distribution by Type
        const customerDistribution = await User.aggregate([
            {
                $group: {
                    _id: "$customerType",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 5. Top Selling Products
        const topProducts = await Payment.aggregate([
            {
                $match: {
                    status: "successful",
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $unwind: "$order"
            },
            {
                $group: {
                    _id: "$order.productId._id",
                    productName: { $first: "$order.productId.name" },
                    totalQuantity: { $sum: "$order.qty" },
                    totalRevenue: { 
                        $sum: { $multiply: ["$order.qty", "$order.price"] }
                    }
                }
            },
            {
                $sort: { totalQuantity: -1 }
            },
            {
                $limit: 5
            }
        ]);

        // 6. Payment Success Rate
        const totalPaymentAttempts = await Payment.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });
        
        const successfulPayments = await Payment.countDocuments({
            status: "successful",
            createdAt: { $gte: thirtyDaysAgo }
        });

        const paymentSuccessRate = totalPaymentAttempts > 0 
            ? (successfulPayments / totalPaymentAttempts) * 100 
            : 0;

        // 7. Calculate Growth Rates
        const previousPeriodStart = new Date(thirtyDaysAgo.getTime() - (30 * 24 * 60 * 60 * 1000));
        
        const previousPeriodStats = await Payment.aggregate([
            {
                $match: {
                    status: "successful",
                    createdAt: {
                        $gte: previousPeriodStart,
                        $lt: thirtyDaysAgo
                    }
                }
            },
            {
                $unwind: "$order"
            },
            {
                $group: {
                    _id: null,
                    previousSales: {
                        $sum: { $multiply: ["$order.qty", "$order.price"] }
                    },
                    previousOrders: { $sum: 1 }
                }
            }
        ]);

        const previousSales = previousPeriodStats[0]?.previousSales || 0;
        const previousOrders = previousPeriodStats[0]?.previousOrders || 0;

        const salesGrowth = previousSales > 0 
            ? ((totalSales - previousSales) / previousSales) * 100 
            : 0;
        
        const orderGrowth = previousOrders > 0 
            ? ((totalOrders - previousOrders) / previousOrders) * 100 
            : 0;

        // Prepare Response
        const responseData = {
            summary: {
                totalSales,
                totalCustomers,
                totalOrders,
                avgOrderValue,
                newCustomers,
                paymentSuccessRate
            },
            growth: {
                sales: salesGrowth.toFixed(2),
                orders: orderGrowth.toFixed(2),
                customers: ((newCustomers / totalCustomers) * 100).toFixed(2)
            },
            monthlyRevenue,
            customerDistribution,
            topProducts
        };

        return res.status(200).json(
            new Apiresponse(200, responseData, "Dashboard stats retrieved successfully")
        );

    } catch (error) {
        console.error("Dashboard stats error:", error);
        throw new Apierror(500, error.message || "Error fetching dashboard stats");
    }
});


export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateAccountDetails,
    updateCart,
    updateUserAvatar,
    refreshAccessToken,
    requestPasswordReset,
    resetForgotPassword,
    getCustomerAnalytics,
    updateCustomerStatus,
    getAllCustomers,
    getDashboardStats,
}