import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../models/admins.model.js";
import { sendVarificationCodeOnMail } from "../utils/sendMail.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

//Generate Access And Refresh token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const admin = await Admin.findById(userId);
    if (!admin) throw new Error("User not found");
    //Create access and refresh tokens
    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();
    console.log(refreshToken);
    admin.refreshToken = refreshToken;
    //{ validateBeforeSave: false } iska mutlub kuch bhe validate mat kigia direct save ho jaia db ma
    await admin.save({ validateBeforeSave: false });
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
  // const { address, fullName, lastName, role } = req.body;
  const { email, contactNumber } = req.body;

  // Check for required fields
  const requiredFields = [
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
    await sendVarificationCodeOnMail({ email, code });
    return res
      .status(201)
      .json(new ApiResponse(200, "Verification code sent to your email!"));
  }

  // Create new user
  const verificationCode = generateVerificationCode();
  const newUser = { ...userData, address, verificationCode };
  // const newUser = { fullName, lastName, role, address, verificationCode };
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

//Validate OTP and get Access & Refresh Token
const otpVerification = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  console.log([email, otp]);

  // Validate input fields
  if (!email || !otp) {
    throw new ApiError(400, "Both email and OTP are required.");
  }

  // Validate email format
  if (!isValidEmail(email)) {
    throw new ApiError(403, "Invalid email format.");
  }

  // Find user by email
  const existUser = await Admin.findOne({ email }).select(
    "-password -refreshToken"
  );

  if (!existUser) {
    throw new ApiError(404, "User not found with the provided email.");
  }

  // Validate OTP
  if (Number(existUser.verificationCode) !== Number(otp)) {
    throw new ApiError(403, "Invalid OTP entered.");
  }

  // Calculate OTP expiration
  const givenTimestamp = new Date(existUser.updatedAt).getTime();
  const currentTimestamp = Date.now();
  const differenceInMinutes = Math.floor(
    (currentTimestamp - givenTimestamp) / (1000 * 60)
  );

  if (differenceInMinutes > 7) {
    throw new ApiError(405, "OTP has expired.");
  }

  // Check if email is already verified
  // if (existUser.emailVerify) {
  //   throw new ApiError(409, "Email is already verified.");
  // }

  // Mark the email as verified
  existUser.emailVerify = true;

  // Save the changes
  await existUser.save();

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    existUser._id
  );

  const user = {
    _id: existUser._id,
    email: existUser.email,
  };
  // const user = await Admin.findByIdAndUpdate(existUser._id, {
  //   emailVerify: true,
  // }).select("-password -verificationCode -refreshToken");

  // Set cookie options
  const cookieOptions = {
    httpOnly: true,
    // secure: true,
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
        "User validated."
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

  const user = await Admin.findById(req.user._id).select(
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

  const userNameCheake = await Admin.findOne({ userName });

  if (userNameCheake) {
    throw new ApiError(403, "User name alwarady exist!.");
  }

  const user = await Admin.findById(req.user._id).select(
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

  const user = await Admin.findById(req.user._id).select(
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

  const user = await Admin.findOne({
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

  const logdedInUser = await Admin.findById(user._id).select(
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
  await Admin.findByIdAndUpdate(req.user._id, {
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

//Update user detail by admin Only
const updateUserByAdmin = asyncHandler(async (req, res) => {
  // Validate if userId is provided
  if (!req.query.userId) {
    throw new ApiError(400, "User ID is required.");
  }

  if (!req.user || req.user.role.toLowerCase() !== "admin") {
    throw new ApiError(403, "You are not authorized for this action.");
  }

  const { userId } = req.query;

  try {
    // Fetch the user from the database
    const userToUpdate = await Admin.findById(userId).select(
      "-password -refreshToken -verificationCode"
    );

    // Check if the user exists
    if (!userToUpdate) {
      throw new ApiError(404, "User not found.");
    }

    // Extract the fields to update from the request body
    const { fullName, lastName, role, email, contactNumber } = req.body;

    // Update the user's fields if they are provided
    if (fullName) {
      userToUpdate.fullName = fullName;
    }
    if (lastName) {
      userToUpdate.lastName = lastName;
    }
    if (role) {
      userToUpdate.role = role;
    }
    if (email) {
      if (!isValidEmail(email)) {
        throw new ApiError(400, "Invalid email id!");
      }
      userToUpdate.email = email;
    }
    if (contactNumber) {
      if (!isValidIndianPhoneNumber(contactNumber)) {
        throw new ApiError(400, "Invalid contact number!");
      }
      userToUpdate.contactNumber = contactNumber;
    }

    // Save the updated user details
    await userToUpdate.save();

    // Send response
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          userToUpdate,
          "User details updated successfully by admin."
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error updating user details.");
  }
});

//Delite any user
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.query.userId;

  // Check if the user is an admin
  if (req.user.role.toLowerCase() !== "admin") {
    throw new ApiError(403, "You are not authorized to delete users.");
  }

  // Check if the user exists
  const user = await Admin.findById(userId).select(
    "-password -refreshToken -verificationCode"
  );
  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  // Delete the user
  await Admin.findByIdAndDelete(userId);

  res.status(200).json(new ApiResponse(200, {}, "User deleted successfully."));
});

//Add address more
const addAddress = asyncHandler(async (req, res) => {
  const userId = req.query.userId;
  const addressDetails = req.body;

  // Check if the user exists
  const user = await Admin.findById(userId).select(
    "-password -refreshToken -verificationCode"
  );
  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  // Add the new address to the user's address array
  user.address.push(addressDetails);

  // Save the updated user document
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, user, "Address added successfully."));
});

//Delete address
const deleteAddress = asyncHandler(async (req, res) => {
  const userId = req.query.userId;
  const addressIndex = req.query.addressIndex;

  // Check if the user exists
  const user = await Admin.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  // Check if the address index is valid
  if (addressIndex < 0 || addressIndex >= user.address.length) {
    throw new ApiError(400, "Invalid address index!");
  }

  // Remove the address at the specified index
  user.address.splice(addressIndex, 1);

  // Save the updated user document
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, user, "Address deleted successfully."));
});

//Return all user
const getAllUsers = asyncHandler(async (req, res) => {
  // Fetch all user documents
  const users = await Admin.find({}).select(
    "-password -refreshToken -verificationCode"
  );

  res
    .status(200)
    .json(new ApiResponse(200, users, "All users retrieved successfully."));
});

//Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const userId = req.query.userId;

  // Check if the user exists
  const user = await Admin.findById(userId).select(
    "-password -verificationCode -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  // Send response
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details retrieved successfully."));
});

export {
  register,
  otpVerification,
  passwordUpdate,
  userNameUpdate,
  avatarUpdate,
  updateUserByAdmin,
  loginUser,
  logoutUser,
  deleteUser,
  addAddress,
  deleteAddress,
  getAllUsers,
  getUserById,
};
