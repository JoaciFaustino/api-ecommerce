import multer from "multer";
import path from "path";
import { ApiError } from "../utils/ApiError";
import crypto from "crypto";
import "dotenv/config";

const mimeTypesAllowed = [
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/webp"
];

const storageType = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "..", "public", "uploads"));
    },
    filename: (req, file, cb) => {
      const fileName =
        crypto.randomBytes(16).toString("hex") + "_" + file.originalname;

      cb(null, fileName);
    }
  }),
  cloudinary: multer.memoryStorage()
};

const storage =
  process.env.DESTINATION_STORAGE_IMAGES === "cloudinary"
    ? storageType.cloudinary
    : storageType.local;

const upload = multer({
  storage: storage,
  dest: path.resolve(__dirname, "..", "..", "public", "uploads"),
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    if (!mimeTypesAllowed.includes(file.mimetype)) {
      cb(new ApiError("invalid file type", 400));
      return;
    }

    cb(null, true);
  }
});

export { upload };
