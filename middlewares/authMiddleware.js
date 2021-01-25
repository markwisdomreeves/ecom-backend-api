import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";


const protect = asyncHandler(async (req, res, next) => {

    let token;

    // TO CHECK IF THE TOKEN FOR THE USER EXIST IN THE AUTHORIZATION HEADER
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // IF TOKEN EXIST, WE USE SPLIT AND GET ONLY THE TOKEN
            token = req.headers.authorization.split(' ')[1];

            // AFTER THAT, NEXT, WE DECODE THE TOKEN
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // AND THIS IS THE VALUE WE GET BACK. THE USE VALUE
            // THIS IS VERY INPORTANT -- req.user -- Because this is what we
            // will get access to for all our PROTECTED ROUTES.
            req.user = await User.findById(decoded.id).select('-password'); 
            // we are using -password because we do not want to return the user password and this is great.

            next();

        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token")
    }

})


// admin middleware
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin')
    }
}


export { protect, admin }