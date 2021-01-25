import  express from 'express';

const router = express.Router();

import CreateNewsLettersCtr from "../controllers/CreateNewsLettersCtr.js";


// REGISTER USER ROUTE
router.route('/newsletter')
   .post(CreateNewsLettersCtr.NewsLetterSignUp)




export default router;