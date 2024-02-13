import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define the address sub-schema
const addressSchema = new Schema({
  street: {
    type: String,
    required: true,
    lowercase: true,
  },
  city: {
    type: String,
    required: true,
    lowercase: true,
  },
  zipCode: {
    type: Number,
    required: true,
    lowercase: true,
  },
  state: {
    type: String,
    required: true,
    lowercase: true,
  },
  country: {
    type: String,
    required: true,
    lowercase: true,
    default: "india",
  },
});

// Define the main admin schema
const adminSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    emailVerify: {
      type: Boolean,
      index: true,
      default: false,
    },
    verificationCode: {
      type: Number,
    },
    contactNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
    },
    address: [addressSchema],
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "editor", "uploader", "viewer"],
      default: "editor",
      lowercase: true,
    },
    refreshToken: String, // No need to specify required, as it's optional
  },
  { timestamps: true }
);

// Hash the password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if password is correct
adminSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

// Method to generate access token
adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Method to generate refresh token
adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// Export the Admin model
export const Admin = mongoose.model("Admin", adminSchema);
