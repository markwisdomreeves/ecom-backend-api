import asynceHandler from "express-async-handler";
import Orders from "../models/orderModel.js";


// orders controller
const orderCtrl = {

    // @desc    Create new order
    // @route   POST /api/orders
    // @access  Private
    addOrderItems: asynceHandler(async (req, res) => {
        const {
           orderItems,
           shippingAddress,
           paymentMethod,
           itemsPrice,
           taxPrice,
           shippingPrice,
           totalPrice, 
        } = req.body

        if (orderItems && orderItems.length === 0) {
            res.status(400)
            throw new Error('No order items avaliable')
            return 
        } else {
            const order = new Orders({
                // because I want to get the user token, I added the req.user._id
                user: req.user._id,
                orderItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            })

            const createdOrder = await order.save()

            res.status(201).json(createdOrder)
        }
    }),


    // @desc    Get order by ID
    // @route   GET /api/orders/:id
    // @access  Private
    getOrderById: asynceHandler(async (req, res) => {
        // I used the populate method to also get the user name and email and attach it to the user ID
        const order = await Orders.findById(req.params.id).populate(
            'user',
            'name email'
        )

        if (order) {
             res.json(order)
        } else {
            res.status(404)
            throw new Error('Order not found')
        }
    }),


    // @desc    Update order to paid
    // @route   GET /api/orders/:id/pay
    // @access  Private
    updateOrderToPaid: asynceHandler(async (req, res) => {
        const order = await Orders.findById(req.params.id)

        if (order) {
            // THESE INFO WILL BE ADDED FROM PAYPAL
            order.isPaid = true
            order.paidAt = Date.now()
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.payer.email_address,
            }

            const updatedOrder = await order.save()

            res.json(updatedOrder)
        } else {
            res.status(404)
            throw new Error('Order not found')
        }
    }),


    // @desc    Update order to delivered
    // @route   GET /api/orders/:id/deliver
    // @access  Private/Admin
    updateOrderToDelivered: asynceHandler(async (req, res) => {
        const order = await Orders.findById(req.params.id)

        if (order) {
            order.isDelivered = true
            order.deliveredAt = Date.now()

            const updatedOrder = await order.save()

             res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found')
        }
    }),


    // @desc    Get all orders
    // @route   GET /api/orders
    // @access  Private/Admin
    getAndViewEveryUserOrders: asynceHandler(async (req, res) => {
        const orders = await Orders.find({}).populate('user', 'id name')
        res.json(orders)
    }),


    // @desc    Get logged in user orders
    // @route   GET /api/orders/myorders
    // @access  Private
    getMyOrdersAsUser: asynceHandler(async (req, res) => {
        const orders = await Orders.find({ user: req.user._id })
        res.json(orders)
    }),
    

}



export default orderCtrl;