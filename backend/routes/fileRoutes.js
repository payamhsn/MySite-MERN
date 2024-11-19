import express from "express";
import multer from "multer";
import path from "path";
import {
  uploadFile,
  getFiles,
  deleteFile,
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

const upload = multer({ storage: storage });

router
  .route("/")
  .get(protect, getFiles)
  .post(protect, upload.single("file"), uploadFile);
router.route("/:id").delete(protect, deleteFile);
router.route("/:id/download").get(protect, downloadFile);

export default router;
