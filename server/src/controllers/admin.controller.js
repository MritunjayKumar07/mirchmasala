import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../models/admins.model.js";
import { sendVarificationCodeOnMail } from "../utils/sendMail.js";

//Generate Access And Refresh token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    //Create access and refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    //{ validateBeforeSave: false } iska mutlub kuch bhe validate mat kigia direct save ho jaia db ma
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

//Generate varification code
const generateVerificationCode = () => {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

//Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

//PhoneNumber validation function
function isValidIndianPhoneNumber(phoneNumber) {
  const indianPhoneNumberRegex = /^[6-9]\d{9}$/;
  const numericPhoneNumber = phoneNumber.replace(/\D/g, "");
  return indianPhoneNumberRegex.test(numericPhoneNumber);
}

// Register new admin or user
const register = asyncHandler(async (req, res) => {
  const { address, ...userData } = req.body;
  const { email, contactNumber } = req.body;

  // Check for required fields
  const requiredFields = [
    "userName",
    "fullName",
    "lastName",
    "role",
    "email",
    "contactNumber",
  ];
  requiredFields.forEach((field) => {
    if (!userData[field]) {
      throw new ApiError(400, `${field} field is required!`);
    }
  });

  // Validate email and contact number
  if (!isValidEmail(email)) {
    throw new ApiError(400, "Invalid email id!");
  }
  if (!isValidIndianPhoneNumber(contactNumber)) {
    throw new ApiError(400, "Invalid contact number!");
  }

  // Check if address and its fields are present
  if (!address || address.length === 0) {
    throw new ApiError(400, "Address details are required!");
  }
  const addressFields = ["street", "city", "zipCode", "state", "country"];
  address.forEach((addressDetail) => {
    addressFields.forEach((field) => {
      if (!addressDetail[field]) {
        throw new ApiError(
          400,
          `${field} field is required in address details!`
        );
      }
    });
  });

  // Check if an admin exists
  const existingAdmin = await Admin.findOne({ role: "admin" });
  if (!existingAdmin && req.body.role.toLowerCase() !== "admin") {
    throw new ApiError(400, "First registration requires an admin!");
  }

  // Check if user already exists
  const existUser = await Admin.findOne({ email });
  if (existUser) {
    const code = generateVerificationCode();
    await sendVerificationCodeByEmail({ email, code });
    return res
      .status(201)
      .json(new ApiResponse(200, "Verification code sent to your email!"));
  }

  // Create new user
  const verificationCode = generateVerificationCode();
  const newUser = { ...userData, address, verificationCode };
  const user = await Admin.create(newUser);

  if (!user) {
    throw new ApiError(500, "Server error while creating the account!");
  }

  // Send verification email
  const success = await sendVarificationCodeOnMail({
    email,
    code: verificationCode,
  });
  if (!success) {
    throw new ApiError(500, "Failed to send verification email!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "Verification code sent to your email!"));
});

export { register };
