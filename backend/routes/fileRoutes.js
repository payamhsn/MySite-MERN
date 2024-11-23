import express from "express";
import multer from "multer";
import path from "path";
import {
  uploadFile,
  getFiles,
  deleteFile,
  countFiles,
  downloadFile,
} from "../controllers/fileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

router
  .route("/")
  .get(protect, getFiles)
  .post(protect, upload.single("file"), uploadFile);
router.route("/:id").delete(protect, deleteFile);
router.route("/:id/download").get(protect, downloadFile);
router.route("/count").get(protect, countFiles);

export default router;
