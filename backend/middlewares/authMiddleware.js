import jwt from "jsonwebtoken";
import Auth from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    // Check token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Auhtorized",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the request
    req.user = await Auth.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
