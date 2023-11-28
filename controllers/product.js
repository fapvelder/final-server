import { v2 as cloudinary } from "cloudinary";
import { ProductModel } from "../models/product.js";

export const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({})
      .sort({ createdAt: -1 })
      .populate("category");
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ _id: req.body.id }).populate(
      "category"
    );
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const createProduct = async (req, res) => {
  try {
    const body = req.body.product;
    const fileStr = body.url;
    let imgURL;
    if (fileStr) {
      const uploadedResponse = await cloudinary.uploader.upload(fileStr);
      imgURL = uploadedResponse.url;
    }
    const product = ProductModel({
      title: body.title,
      description: body.description,
      category: body.category,
      status: "On Sale",
      price: body.price,
      isAvailable: true,
      photos: imgURL,
    });
    await product.save();
    res.status(200).send("Product created successfully");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const deleteProduct = req.params.id;
    const product = await ProductModel.findByIdAndDelete(deleteProduct, {
      new: true,
    });
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const findProduct = async (req, res) => {
  const { keyword } = req.query;
  console.log(req.query);
  const regex = new RegExp(keyword, "i");
  const products = await ProductModel.find({ title: { $regex: regex } });
  res.send(products);
};
