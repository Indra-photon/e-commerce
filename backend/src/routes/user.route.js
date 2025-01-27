import {Router} from 'express'
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { registerUser} from '../controllers/user.controller.js'
import {loginUser} from '../controllers/user.controller.js' 
import {getCurrentUser} from '../controllers/user.controller.js'
import {logoutUser} from '../controllers/user.controller.js'
import {requestPasswordReset} from '../controllers/user.controller.js'
import {resetForgotPassword} from '../controllers/user.controller.js'
import { updateAccountDetails } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multur.middlewares.js';
import { updateUserAvatar, getAllCustomers, getCustomerAnalytics, updateCustomerStatus,
  getDashboardStats
  } from '../controllers/user.controller.js';

const router = Router()

router.route("/register").post(registerUser)
router.route("/signin").post(loginUser)
router.route("/getuser").get(verifyJWT, getCurrentUser)
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/update-avatar").patch(
    verifyJWT, 
    upload.single('avatar'), // Changed from fields to single
    updateUserAvatar
  )

router.route("/forgot-password").post(requestPasswordReset)
router.route("/reset-password").post(resetForgotPassword)
router.route("/customers").get(verifyJWT, getAllCustomers)
router.route("/customers/:userId/analytics").get(verifyJWT, getCustomerAnalytics)
router.route("/customers/:userId/status").patch(verifyJWT, updateCustomerStatus)
router.route("/dashboard-stats").get(verifyJWT, getDashboardStats);
router.route("/dashboard-test").get(verifyJWT, (req, res) => {
  res.status(200).json(
      new Apiresponse(200, { message: "Dashboard API is accessible" }, "Test successful")
  );
});


export default router