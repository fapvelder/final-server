import { CategoryModel } from "../models/category.js";

export const getCategory = async (req, res) => {
  try {
    const category = await CategoryModel.find({}).lean();
    res.status(200).send(category);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const createCategory = async (req, res, next) => {
  try {
    const category = new CategoryModel({ name: req.body.name });
    await category.save();
    res.status(200).json(category);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const deleteCategory = req.params.id;
    const category = await CategoryModel.findByIdAndDelete(deleteCategory, {
      new: true,
    });
    res.status(200).send(category);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
