import  express from 'express';
import { protect, admin  } from "../middlewares/authMiddleware.js";

const router = express.Router();

// import controllers
import userCtrl from "../controllers/userControllers.js";


// REGISTER USER ROUTE
router.route('/')
   .post(userCtrl.registerUser)
   // GET OR VIEW ALL USER INFOs ROUTE
   .get(protect, admin, userCtrl.getAllUsers)

// LOGIN USER ROUTE
router.route('/login')
   .post(userCtrl.loginUser)

// VIEWING USER PROFILE ROUTE
router.route('/profile')
    .get(protect, userCtrl.getUserProfile)
    .put(protect, userCtrl.updateUserProfile)

// MANAGING AND CONTROLLING SINGLE USER INFOs ROUTES 
router.route('/:id')
    .delete(protect, admin, userCtrl.deleteSingleUser)
    .get(protect, admin, userCtrl.getSingleUserById)
    .put(protect, admin, userCtrl.updateSingleUser)



export default router;