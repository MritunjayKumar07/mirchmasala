//Upload Image on cloudinary
import { v2 as cloudinary } from "cloudinary";
import envConfig from "../config/envConfig.js";
import fs from "fs";

cloudinary.config({
  cloud_name: envConfig.cloudinaryName,
  api_key: envConfig.cloudinaryApiKey,
  api_secret: envConfig.cloudinaryApiSecret,
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
    console.log(response);
  } catch (error) {
    fs.unlinkSync(localFilePath);
  }
};

export default { uploadOnCloudinary };
