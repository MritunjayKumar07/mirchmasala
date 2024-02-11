// uploadOnCloudinary.js
import { v2 as cloudinary } from "cloudinary";
import envConfig from "../config/envConfig.js";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (locationFilePath) => {
  try {
    if (!locationFilePath) return null;
    const response = await cloudinary.uploader.upload(locationFilePath, {
      resource_type: "auto",
      folder: "my_folder",
    });
    // File Upload Successfully
    console.log("File Upload Successfully");
    return response;
  } catch (error) {
    fs.unlinkSync(locationFilePath);
    throw error;
  }
};

export default uploadOnCloudinary;
