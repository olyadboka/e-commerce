import upload from "../config/multer";

export const uploadProductImages = (req, res, next) => {
  const uploadMiddleware = upload.array("proImages", 5);

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

    next();
  });
};

export default uploadProductImages;
