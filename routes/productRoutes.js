import  express from 'express';
const router = express.Router();

// import controllers
import productCtrl from "../controllers/productCtrl.js";
import { protect, admin } from "../middlewares/authMiddleware.js";


router.route('/')
   .get(productCtrl.getAllProducts)
   .post(protect, admin, productCtrl.createSingleProduct)

router.route('/:id/reviews')
    .post(protect, productCtrl.createProductReview)

router.route('/top')
    .get(productCtrl.getTopRatedProduct)

router.route('/:id')
    .get(productCtrl.getSingleProduct)
    .put(protect, admin, productCtrl.updateSingleProduct)
    .delete(protect, admin, productCtrl.deleteSingleProduct)





export default router;