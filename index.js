import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import users from "./routers/user.js";
import dotenv from "dotenv";
import products from "./routers/product.js";
import category from "./routers/category.js";
import paypal from "./routers/paypal.js";
import order from "./routers/order.js";
dotenv.config();
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

export const app = express();
const PORT = process.env.port || 5000;
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb" }));
app.use(morgan("combined"));
app.use(cookieParser());
const allowOrigin = [
  process.env.FRONTEND_URL,
  process.env.BACKEND_URL,
  "http://localhost:5000",
  "http://localhost:3000",
];
const corsOptions = {
  credentials: true,
  origin: allowOrigin,
  allowedHeaders: [
    "Origin",
    "Content-Type",
    "Accept",
    "x-access-token",
    "authorization",
    "x-signature",
    "custom-header",
  ],
  methods: "GET, HEAD, OPTIONS, PUT, PATCH, POST, DELETE",
  preflightContinue: false,
};
app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.send("SUCCESS");
  console.log("SUCCESS");
});

//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose
  .connect(process.env.URI_MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => {
    console.log("ERR", err);
  });
const server = app.listen(5000, () => {
  console.log("server is listening on port 5000");
});

app.use("/users", users);
app.use("/category", category);
app.use("/products", products);
app.use("/paypal", paypal);
app.use("/orders", order);
