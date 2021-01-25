import asynceHandler from "express-async-handler";
import Products from "../models/productModel.js";


// products controller
const productCtrl = {

    // @desc     Get / Fetch all products
    // @route    GET /api/products
    // @access   Public
    // getAllProducts: asynceHandler(async(req, res, next) => {
    //     const products = await Products.find({});

    //     res.json(products);
      
    //     res.status(500).json({ message: error.message });
    
    // }),


    getAllProducts: asynceHandler(async (req, res) => {
        // page pagination
        const pageSize = 8; //ten items per page
        const page = Number(req.query.pageNumber) || 1

        // search form
        const keyword = req.query.keyword 
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
              }   
            : 
              {}
        
        // page pagination
        const count = await Products.countDocuments({ ...keyword })
        const products = await Products.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1))

        res.json({ products, page, pages: Math.ceil(count / pageSize) })
    }),


    // @desc     Get / Fetch a single product
    // @route    GET /api/products/:id
    // @access   Public
    getSingleProduct: asynceHandler(async (req, res) => {
        const product = await Products.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found')
        }
    }),


    // @desc    Create a product
    // @route   POST /api/products
    // @access  Private/Admin
    createSingleProduct: asynceHandler(async (req, res) => {
        const product = new Products({
            name: 'Sample name',
            price: 0,
            user: req.user._id, // this is the login user with thier token
            image: '/images/sample.jpg',
            brand: 'Sample brand',
            category: 'Sample category',
            countInStock: 0,
            numReviews: 0,
            description: 'Sample description',
        });

        const createdProduct = await product.save()
        res.status(201).json(createdProduct)
    }),


    // @desc    Update a product
    // @route   PUT /api/products/:id
    // @access  Private/Admin
    updateSingleProduct: asynceHandler(async (req, res) => {
        const {
            name,
            price,
            description,
            image,
            brand,
            category,
            countInStock,
        } = req.body

        const product = await Products.findById(req.params.id)

        if (product) {
            product.name = name
            product.price = price
            product.description = description
            product.image = image
            product.brand = brand
            product.category = category
            product.countInStock = countInStock

            const updatedProduct =  await product.save()
            res.json(updatedProduct)
        } else {
            res.status(404)
            throw new Error('Product not found')
        }

    }),


    // @desc    Delete a product
    // @route   DELETE /api/products/:id
    // @access  Private/Admin
    deleteSingleProduct: asynceHandler(async (req, res) => {
        const singleProduct = await Products.findById(req.params.id);

        if (singleProduct) {
            await singleProduct.remove()
            res.json({ message: 'Product removed' })
        } else {
            res.status(404)
            throw new Error('Product not found')
        }
    }),


    // @desc    Create new review
    // @route   POST /api/products/:id/reviews
    // @access  Private
    createProductReview: asynceHandler(async (req, res) => {
        const { rating, comment } = req.body;

        const product = await Products.findById(req.params.id)

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            )

            if (alreadyReviewed) {
                res.status(400)
                throw new Error('You already reviewed this Product')
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id, // login user with their token
            }

            product.reviews.push(review)

            product.numReviews = product.reviews.length

            product.rating = 
                product.reviews.reduce((acc, item) => item.rating + acc, 0) / 
                product.reviews.length

            await product.save()

            res.status(201).json({ message: 'Review has been added' })
        } else {
            res.status(404)
            throw new Error('Product is not found')
        }
    }),

    // @desc    Get top rated products
    // @route   GET /api/products/top
    // @access  Public
    getTopRatedProduct: asynceHandler(async (req, res) => {
        const products = await Products.find({}).sort({ rating: -1 }).limit(3)

         res.json(products);
    })

}



export default productCtrl;