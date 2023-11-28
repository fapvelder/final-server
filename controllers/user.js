import { generateAccessToken, createSlug } from "../utils.js";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.js";
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
