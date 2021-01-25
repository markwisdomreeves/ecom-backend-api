import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";

import users from "./data/users.js";
import products from "./data/products.js";

import ProductModel from "./models/productModel.js";
import OrderModel from "./models/orderModel.js";
import UserModel from "./models/userModel.js";

import connectDB from "./config/db.js";

// .env variable
dotenv.config({ path: './config/.env' });

// connection to DB
connectDB();


const importData = async () => {
    try {
        await OrderModel.deleteMany();
        await ProductModel.deleteMany();
        await UserModel.deleteMany();

        const createdUsers = await UserModel.insertMany(users);

        const adminUser = createdUsers[0]._id;

        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser }
        });

        await ProductModel.insertMany(sampleProducts);

        console.log('Data Imported...'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};
    

// Import all data into the DB at onces
const destroyData = async () => {
    try {
        await OrderModel.deleteMany();
        await ProductModel.deleteMany();
        await UserModel.deleteMany();

        console.log('Data Destroyed!...'.red.inverse)
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

// RUN  npm run data:import  to run the command from the 
// package json file to import all data from the DB at onces
if (process.argv[2] === '-d') {
    destroyData();
   // RUN  npm run data:destroy  to run the command from the 
   // package json file to destroy or delete all data from the DB at onces
} else {
    importData();
}



