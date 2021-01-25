import  express from 'express';
const router = express.Router();

// import controllers
import orderCtrl from "../controllers/orderCtrl.js";
import { protect, admin } from "../middlewares/authMiddleware.js";


router.route('/')
   .post(protect, orderCtrl.addOrderItems)
   .get(protect, admin, orderCtrl.getAndViewEveryUserOrders)

router.route('/myorders')
    .get(protect, orderCtrl.getMyOrdersAsUser)

// Must alway place the id routes at the buton of all routes
router.route('/:id')
    .get(protect, orderCtrl.getOrderById)

router.route('/:id/pay')
    .put(protect, orderCtrl.updateOrderToPaid)
   
router.route('/:id/deliver')
    .put(protect, admin, orderCtrl.updateOrderToDelivered)
   




export default router;