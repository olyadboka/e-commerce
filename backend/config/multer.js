// multer.js
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "products",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
      public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
      resource_type: "auto",
      timeout: 120000, // 2 minutes timeout per file
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB max file size
    files: 5, // Maximum 5 files
  },
});

// Middleware to handle file uploads and errors
export const uploadProductImages = (req, res, next) => {
  const uploadMiddleware = upload.array("proImages", 5); // Max 5 images

  uploadMiddleware(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          success: false,
          error: "File size too large (max 3MB)",
        });
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(413).json({
          success: false,
          error: "Too many files uploaded (max 5)",
        });
      }
      if (err.message.includes("Only image files")) {
        return res.status(400).json({
          success: false,
          error: "Only image files are allowed",
        });
      }
      return res.status(500).json({
        success: false,
        error: "File upload failed",
        details: err.message,
      });
    }

    // Continue if no errors
    next();
  });
};

export default upload;
