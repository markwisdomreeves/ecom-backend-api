import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose"
import express from "express";
import morgan from "morgan";
import colors from "colors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import cors from "cors";
import xss from "xss-clean";
import hpp from "hpp";

// ERROR MIDDLEWARE
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";


// IMPORT ALL ROUTES
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import signUpLetterRoutes from "./routes/signUpLetterRoutes.js";

dotenv.config()

// EXPRESS APPLICATION
const app = express();

// APPLICATION MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));

// BODY-PARSER
app.use(bodyParser.json());

// COOKIE-PARSER
app.use(cookieParser());

// MONGO SANITIZE DATA
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Prevent http param pollution for hackers
app.use(hpp());

// Set security headers for hackers
app.use(helmet());

// Enable CORS
app.use(cors());

// morgan logging middleware only running in development mode
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('dev'));
}

app.use(express.json());

// MOUNT ALL ROURES
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID)
});

// Mail Chimp News Letter route
app.post('/signup', signUpLetterRoutes)


app.get('*', (req, res) => {
    res.send('API is running... -- use ( /api/products ) routes to view products')
})

// UPLOAD IMAGES PATH
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))


// CONNECT TO MONGODB
const URL = process.env.MONGODB_URL
mongoose.connect(URL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Database connection was successful"))
.catch(error => console.log("SORRY, DB CONNECTION ERROR: ", error));


// THE ERROR MIDDLEWARES MUST COME AFTER THE ROUTES
app.use(notFound);
app.use(errorHandler);

// SERVER PORT
const port = process.env.PORT || 5000;

// STARTING THE SERVER
const server = app.listen(port, () => {
    console.log(`Server started in ${process.env.NODE_ENV} mode on port: ${port}`.yellow.bold);
});

// // HANDLING GLOBAL ERROR FOR MONGODB DATABASE CONNECTION
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // CLOSE SERVER ON ERROR & EXIT PROCESS
    server.close(() => process.exit(1));
});