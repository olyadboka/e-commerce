// authentictation middleware

import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";
import "dotenv/config";

export const protectedMiddleWare = async (req, res, next) => {
  try {
    const token = req.cookie.token;
    if (!token) {
      res.status(401).json({
        success: false,
        message: "user is not logged in ",
      });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    const userId = decodedToken.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
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
