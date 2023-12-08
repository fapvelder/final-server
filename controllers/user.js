import { generateAccessToken, createSlug } from "../utils.js";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.js";
export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}).sort({ createdAt: -1 });
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userID);
    if (user) {
      res.send({
        _id: user._id,
        fullName: user.fullName,
        avatar: user.avatar,
        slug: user.slug,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body.user;
    console.log(password);
    const user = await UserModel.findOne({ email: email });
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        const accessToken = generateAccessToken(user);
        console.log(accessToken);
        return res.status(200).json({
          _id: user._id,
          token: accessToken,
        });
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const registerUser = async (req, res) => {
  try {
    const { email, fullName, mobile, password } = req.body.user;
    const newUser = new UserModel({
      email: email,
      fullName: fullName,
      mobile: mobile,
      slug: createSlug(fullName),
      password: bcrypt.hashSync(password),
    });
    const user = await newUser.save();

    res.send({
      _id: user._id,
      token: generateAccessToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.id);
    console.log(req.body);
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        user.fullName = req.body.fullName || user.name;
        user.email = req.body.email || user.email;
        const updatedUser = await user.save();
        console.log(user);
        res.send({ message: "Updated profile successfully", updatedUser });
        // res.send({
        //   _id: updatedUser._id,
        //   name: updatedUser.name,
        //   email: updatedUser.email,
        // });
      } else {
        res.status(401).send({ message: "Password is incorrect" });
      }
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
