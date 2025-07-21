import cloudinaryP from "cloudinary";
const { v2: cloudinary } = cloudinaryP;
import "dotenv";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: process.env.NODE_ENV === "production",
  upload_timeout: 120000,
  timeout: 60000,
});

export default cloudinary;
