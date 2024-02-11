import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import { User } from "../models/index.js";
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

const generateVerificationCode = () => {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidIndianPhoneNumber(phoneNumber) {
  const indianPhoneNumberRegex = /^[6-9]\d{9}$/;
  const numericPhoneNumber = phoneNumber.replace(/\D/g, "");
  return indianPhoneNumberRegex.test(numericPhoneNumber);
}

const registerUser = asyncHandler(async (req, res) => {
  // get User Detail (firstName, lastName, email, contactNumber).
  const { firstName, lastName, email, contactNumber } = req.body;

  // validate not empity.
  if (
    [firstName, lastName, email, contactNumber].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  // Validate emailId.
  if (!isValidEmail(email)) {
    throw new ApiError(403, "Invalid email id!");
  }

  // Validate contact Number.
  if (!isValidIndianPhoneNumber(contactNumber)) {
    throw new ApiError(403, "Invalid contact number!");
  }

  // validate email & contactNumber already exists.
  const existUser = await User.findOne({
    $or: [{ email }, { contactNumber }],
  });

  const code = generateVerificationCode();

  // If already exists then Send varification email.
  if (existUser) {
    //Send Mail
    const success = await sendVarificationCodeOnMail({ email, code });
    if (!success) {
      throw new ApiError(500, "Server error while sending email!");
    }
    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          "Cheak your mail box, verification code sended on you mail!"
        )
      );
  }

  // If Not already exists Creat user object and save in mongoDB.
  const user = await User.create({
    firstName: firstName.toLowerCase(),
    lastName: lastName.toLowerCase(),
    email,
    contactNumber,
    verificationCode: code,
  });

  const createdUser = await User.findById(user._id).select("-refreshToken");

  // Cheake data is save or note.
  if (!createdUser) {
    throw new ApiError(500, "Server error while creating the account!");
  }

  //Send Mail
  const success = await sendVarificationCodeOnMail({
    email,
    code,
  });
  if (!success) {
    throw new ApiError(500, "Server error while sending email!");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        "Cheak your mail box, verification code sended on you mail!"
      )
    );
});

const otpVerification = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Validate input fields
  if (!email || !otp) {
    throw new ApiError(400, "Both email and OTP are required.");
  }

  // Validate email format
  if (!isValidEmail(email)) {
    throw new ApiError(403, "Invalid email format.");
  }

  // Find user by email
  const existUser = await User.findOne({ email }).select(
    "-password -refreshToken"
  );

  if (!existUser) {
    throw new ApiError(404, "User not found with the provided email.");
  }

  // Validate OTP
  if (Number(existUser.verificationCode) !== Number(otp)) {
    throw new ApiError(404, "Invalid OTP entered.");
  }

  // Calculate OTP expiration
  const givenTimestamp = new Date(existUser.updatedAt).getTime();
  const currentTimestamp = Date.now();
  const differenceInMinutes = Math.floor(
    (currentTimestamp - givenTimestamp) / (1000 * 60)
  );

  if (differenceInMinutes > 7) {
    throw new ApiError(400, "OTP has expired.");
  }

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    existUser._id
  );

  // Set cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "lax", // Adjust based on your requirements
  };

  // Set cookies and send response
  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: existUser,
          accessToken,
          refreshToken,
        },
        "User validate !."
      )
    );
});

const passwordUpdate = asyncHandler(async (req, res) => {
  const { password } = req.body;

  // Validate input field
  if (!password) {
    throw new ApiError(400, "Password is required.");
  }
  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long.");
  }

  const user = await User.findById(req.user._id).select(
    "-password -verificationCode -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  user.password = password;
  user.verificationCode = null;

  await user.save();
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.verificationCode;

  //Send Response
  return res
    .status(201)
    .json(new ApiResponse(201, userObj, "Password updated successfully!"));
});

const userNameUpdate = asyncHandler(async (req, res) => {
  const { userName } = req.body;

  // Validate input field
  if (!userName) {
    throw new ApiError(400, "userName is required.");
  }

  if (userName.length < 3) {
    throw new ApiError(400, "userName must be at least 3 characters long!.");
  }

  const userNameCheake = await User.findOne({ userName });

  if (userNameCheake) {
    throw new ApiError(403, "User name alwarady exist!.");
  }

  const user = await User.findById(req.user._id).select(
    "-password -verificationCode -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  user.userName = userName;

  await user.save();
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.verificationCode;

  //Send Response
  return res
    .status(201)
    .json(new ApiResponse(201, userObj, "userName updated successfully!"));
});

export { registerUser, otpVerification, passwordUpdate, userNameUpdate };
