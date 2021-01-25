import asynceHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";


// User Auth controller
const userCtrl = {

    // @desc     Register a new user
    // @route    POST /api/users
    // @access   Public
    registerUser: asynceHandler(async (req, res) => {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400)
            throw new Error('This user already exists')
        }

        const user = await User.create({
            name, 
            email,
            password,
        })

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            })
        } else {
            res.status(400)
            throw new Error('Invalid user credentails')
        }
    }),


    // @desc     Authenticate user & get their token
    // @route    POST /api/users/login
    // @access   Public
    loginUser: asynceHandler(async (req, res) => {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });

        // calling the matchPassword method from user Model
        // if user password match, we display the user infos, but if not thow an error
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            })
        } else {
            res.status(401)
            throw new Error('Enter a valid email and password')
        } 
        
    }),

    // @desc     GET user profile
    // @route    GET /api/users/profile
    // @access   Private
    getUserProfile: asynceHandler(async (req, res) => {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            })
        } else {
            res.status((404))
            throw new Error('User not found')
        } 
    }),

    // @desc     UPDATE user profile
    // @route    PUT /api/users/profile
    // @access   Private
    updateUserProfile: asynceHandler(async (req, res) => {
        const user = await User.findById(req.user._id)

        if (user) {
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            if (req.body.password) {
                user.password = req.body.password
            }

            const updatedUser = await user.save()

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser._id),
            })
        } else {
            res.status(404)
            throw new Error('User not found')
        }
    }),

    // @desc     GET all users
    // @route    GET /api/users
    // @access   Private/Admin
    getAllUsers: asynceHandler(async (req, res) => {
        const users = await User.find({})
        res.json(users)
    }),

    // @desc     GET single user by ID
    // @route    GET /api/users/:id
    // @access   Private/Admin
    getSingleUserById: asynceHandler(async (req, res) => {
        const user = await User.findById(req.params.id).select('-password')

        if (user) {
            res.json(user)
        } else {
            res.status(404)
            throw new Error('User not found')
        }
    }),

    // @desc     UPDATE user
    // @route    PUT /api/users/:id
    // @access   Private/Admin
    updateSingleUser: asynceHandler(async (req, res) => {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            user.isAdmin = req.body.isAdmin

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
            })
        } else {
            res.status(404)
            throw new Error('User not found')
        }
    }),

    // @desc     DELETE users
    // @route    DELETE /api/users/:id
    // @access   Private/Admin
    deleteSingleUser: asynceHandler(async (req, res) => {
        const user = await User.findById(req.params.id)

        if (user) {
            await user.remove()
            res.json({ message: 'User removed' })
        } else {
            res.status(404)
            throw new Error('User not found')
        }
    })


}



export default userCtrl;