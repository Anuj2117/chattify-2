import User from "../models/user_model.js";
import { createTokenandSaveCookie } from "../jwt/generateToken.js";
import bcrypt from "bcryptjs";


export const signUp = async (req, res) => {
  try {
    const { fullname, email, password, confirmpassword } = req.body;

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Password don't match" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await new User({
      fullname,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    if (newUser) {
      createTokenandSaveCookie(newUser._id, res);
      res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      return res.status(404).json({ message: "Invalid User or Password" });
    }
    createTokenandSaveCookie(user._id, res);
    res.status(201).json({
      message: "User logged in Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "User logged out Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");
    res.status(201).json( filteredUsers );
  } catch (error) {
    console.log("Error in allUsers Controller: " + error);
  }
};
