// authentictation middleware

import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";
import "dotenv/config";

export const protectedMiddleWare = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "user is not logged in ",
      });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    // console.log(decodedToken);
    const userId = decodedToken.userId;
    // console.log(userId);
    const user = await UserModel.findById(userId);
    // console.log(user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found !",
      });
    }
    // console.log(user);
    req.user = user;
    const user2 = req.user;
    // console.log(user2);
    // console.log(req.user);
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default protectedMiddleWare;
