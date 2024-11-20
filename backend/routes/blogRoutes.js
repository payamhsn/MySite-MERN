import express from "express";
import multer from "multer";
import path from "path";
import {
  getBlogs,
  getUserBlogs,
  countBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
} from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/blogs/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".gif") {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Public routes
// router.get("/", getBlogs);
// router.get("/:id", getBlogById);

// Protected routes
router.get("/count", protect, countBlogs);

router
  .get("/my-blogs", protect, getUserBlogs)
  .get("/", getBlogs)
  .get("/:id", getBlogById);

router.post("/", protect, upload.array("images", 5), createBlog);
router.put("/:id", protect, upload.array("images", 5), updateBlog);
router.delete("/:id", protect, deleteBlog);

export default router;
