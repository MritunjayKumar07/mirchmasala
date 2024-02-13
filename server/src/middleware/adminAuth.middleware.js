import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admins.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyAdminJWT = asyncHandler(async (req, res, next) => {
  try {
    // Check if an admin exists
    const existingAdmin = await Admin.findOne({ role: "admin" });
    if (!existingAdmin) {
      return next(); // Proceed to the next middleware if no admin exists
    }

    // Get the token from the request
    const token = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      throw new ApiError(401, "Unauthorized request! Token not provided.");
    }

    // Verify the JWT and extract data
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Check if the decoded token represents an admin
    if (!decodedToken || !decodedToken._id) {
      throw new ApiError(401, "Invalid Token! Please Login again.");
    }

    const user = await Admin.findById(decodedToken._id).select("-password -refreshToken -verificationCode");
    if (!user) {
      throw new ApiError(401, "Invalid Token! Please Login again.");
    }

    // Set the user in the request object and proceed to the next middleware
    req.user = user;
    next();
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

export default verifyAdminJWT;
