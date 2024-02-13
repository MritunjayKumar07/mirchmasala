import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/index.js";
import { sendVarificationCodeOnMail } from "../utils/sendMail.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

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

//User Registration:-
const registerUser = asyncHandler(async (req, res) => {
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
    emailVerify: false,
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

//Validate OTP and get Access & Refresh Token
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

  const user = await User.findByIdAndUpdate(existUser._id, {
    emailVerify: true,
  }).select("-password -verificationCode -refreshToken");

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
          user,
          accessToken,
          refreshToken,
        },
        "User validate !."
      )
    );
});

//Add password and update also
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

//Add userName & update also
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

//Add avatar & update also
const avatarUpdate = asyncHandler(async (req, res) => {
  if (!req.file.path) {
    throw new ApiError(400, "Avatar file is required!");
  }

  const avatar = await uploadOnCloudinary(req.file.path);
  // console.log(avatar);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required!");
  }

  const user = await User.findById(req.user._id).select(
    "-password -verificationCode -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  user.avatar = avatar.secure_url;
  await user.save();

  return res
    .status(201)
    .json(new ApiResponse(201, user, "Avatar updated successfully!"));
});

//Update user deatil (firstName, lastName, contactNumber, email)
const updateUserDetail = asyncHandler(async (req, res) => {
  const { firstName, lastName, contactNumber, email } = req.body;

  // Define update object
  const updateObject = {};
  if (firstName) updateObject.firstName = firstName;
  if (lastName) updateObject.lastName = lastName;
  if (contactNumber) {
    // Validate contact Number.
    if (!isValidIndianPhoneNumber(contactNumber)) {
      throw new ApiError(403, "Invalid contact number!");
    }

    // validate contactNumber already exists.
    const existUser = await User.findOne({ contactNumber });
    if (existUser) {
      throw new ApiError(403, "Contact number alwarady exists!");
    }

    updateObject.contactNumber = contactNumber;
  }

  if (email) {
    // Validate emailId.
    if (!isValidEmail(email)) {
      throw new ApiError(403, "Invalid email id!");
    }

    // Check if the new email already exists
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      throw new ApiError(403, "Email already exists!");
    }

    // Generate a verification code for the new email
    const code = generateVerificationCode();

    // Send verification email to the new email address
    const success = await sendVarificationCodeOnMail({ email, code });
    if (!success) {
      throw new ApiError(500, "Server error while sending email!");
    }

    // Add the new email and verification code to the update object
    updateObject.email = email;
    updateObject.emailVerify = false;
    updateObject.verificationCode = code;
  }

  let user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateObject },
    { new: true }
  ).select("-password -verificationCode -refreshToken");

  if (email) {
    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          "Cheak your mail box, verification code sended on you mail!"
        )
      );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User details updated successfully!"));
});

//Login User
const loginUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  //validate
  if (!(userName || email)) {
    throw new ApiError(400, "Username or email is required!");
  }
  if (!password) {
    throw new ApiError(400, "Password is required!");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  // Check if user exists
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect Password!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const logdedInUser = await User.findById(user._id).select(
    "-password -refreshToken -verificationCode"
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
          user: logdedInUser,
          accessToken,
          refreshToken,
        },
        "User validate !."
      )
    );
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  // Update user document to clear refreshToken
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: undefined,
    },
  });

  // Clear cookies and send response
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully."));
});

export {
  registerUser,
  otpVerification,
  passwordUpdate,
  userNameUpdate,
  avatarUpdate,
  updateUserDetail,
  loginUser,
  logoutUser,
};
