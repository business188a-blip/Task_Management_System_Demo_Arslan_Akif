import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createTask,
  getTasks,
  getSharedTasks,
  getTaskById,
  updateTask,
  deleteTask,
  shareTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.use(protect);
router.post("/", createTask);
router.get("/", getTasks);
router.get("/shared", getSharedTasks);
router.put("/:id/share", shareTask);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
