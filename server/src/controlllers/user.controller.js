import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import { User } from "../models/index.js";
import { sendVarificationCodeOnMail } from "../utils/sendMail.js";
import envConfig from "../config/envConfig.js";

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
  // validate not empity.
  if ([email, otp].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required!");
  }

  // Validate emailId.
  if (!isValidEmail(email)) {
    throw new ApiError(403, "Invalid email id!");
  }

  // validate email & contactNumber already exists.
  const existUser = await User.findOne({
    $or: [{ email }],
  });

  //Otp Match or not
  console.log(existUser);
});

export { registerUser, otpVerification };
