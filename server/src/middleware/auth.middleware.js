import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import jwt from "jsonwebtoken";

const verifyUserJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unautorized request!");
    }

    const decodedTiken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedTiken._id).select(
      "-password -refreshToken -verificationCode"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Token! Please Login again.");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token !");
  }
});
export default verifyUserJWT;
