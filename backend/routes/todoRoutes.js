import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserTodos,
  createTodo,
  updateTodo,
  countTodos,
  deleteTodo,
} from "../controllers/todoController.js";

const router = express.Router();

router.route("/").get(protect, getUserTodos).post(protect, createTodo);

router.route("/:id").put(protect, updateTodo).delete(protect, deleteTodo);
router.route("/count").get(protect, countTodos);
export default router;
