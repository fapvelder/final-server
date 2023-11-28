import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: mongoose.Schema.Types.Mixed, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    status: { type: String },
    price: { type: Number, required: true },
    photos: { type: String, required: true },
    isAvailable: { type: Boolean, required: true },
  },
  { timestamps: true }
);
export const ProductModel = mongoose.model("Product", productSchema);
