import express from "express";
import {
  getNotes,
  countNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").get(protect, getNotes).post(protect, createNote);

router.route("/:id").put(protect, updateNote).delete(protect, deleteNote);
router.get("/count", protect, countNotes);
export default router;
