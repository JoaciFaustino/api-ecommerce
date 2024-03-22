import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

export const initCloudinary = () => {
  cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
};
