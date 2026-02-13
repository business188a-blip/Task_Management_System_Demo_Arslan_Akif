import fs from "fs";
import path from "path";
import Task from "../models/taskModel.js";
import Notification from "../models/Notification.js";
import User from "../models/userModel.js";
import { io } from "../server.js";

const uploadsDir = path.resolve("uploads");

const isOwner = (task, userId) => String(task.owner) === String(userId);
const canAccess = (task, userId) =>
  isOwner(task, userId) || task.sharedWith.map(String).includes(String(userId));

const ensureUploadsDir = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

const saveAttachment = (attachment) => {
  if (!attachment) return null;

  const { fileName, fileType, contentBase64, size } = attachment;
  if (!fileName || !contentBase64) return null;

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const targetName = `${Date.now()}-${safeName}`;
  const targetPath = path.join(uploadsDir, targetName);

  ensureUploadsDir();
  fs.writeFileSync(targetPath, Buffer.from(contentBase64, "base64"));

  return {
    fileName: safeName,
    fileUrl: `/uploads/${targetName}`,
    fileType: fileType || "",
    size: Number(size) || 0,
  };
};

export const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, attachment } = req.body;
    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      owner: req.user,
      sharedWith: [],
      attachments: [],
    });

    const savedAttachment = saveAttachment(attachment);
    if (savedAttachment) {
      task.attachments.push(savedAttachment);
      await task.save();
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ owner: req.user }, { sharedWith: req.user }],
    }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSharedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ sharedWith: req.user }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || !canAccess(task, req.user)) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || !canAccess(task, req.user)) {
      return res.status(404).json({ message: "Task not found or not authorized" });
    }

    const owner = isOwner(task, req.user);
    const allowedOwnerFields = ["title", "description", "status", "dueDate"];
    const allowedSharedFields = ["status"];
    const allowed = owner ? allowedOwnerFields : allowedSharedFields;

    const incomingKeys = Object.keys(req.body).filter((k) => k !== "attachment");
    const disallowed = incomingKeys.filter((key) => !allowed.includes(key));
    if (disallowed.length > 0) {
      return res.status(403).json({
        message: owner
          ? "Invalid update fields"
          : "Shared users can only update task status",
      });
    }

    const previousStatus = task.status;

    incomingKeys.forEach((key) => {
      task[key] = req.body[key];
    });

    if (owner && req.body.attachment) {
      const savedAttachment = saveAttachment(req.body.attachment);
      if (savedAttachment) {
        task.attachments.push(savedAttachment);
      }
    }

    await task.save();

    if (req.body.status && req.body.status !== previousStatus) {
      const recipients = [String(task.owner), ...task.sharedWith.map(String)].filter(
        (userId) => userId !== String(req.user)
      );

      if (recipients.length) {
        const message = `Task "${task.title}" status changed to "${task.status}"`;
        await Notification.insertMany(
          recipients.map((userId) => ({ userId, type: "status", message }))
        );
        recipients.forEach((userId) => {
          io.to(userId).emit("notification", { type: "status", message });
        });
      }
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user });
    if (!task) return res.status(404).json({ message: "Task not found or not authorized" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const shareTask = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });
    if (String(userId) === String(req.user)) {
      return res.status(400).json({ message: "You cannot share a task with yourself" });
    }

    const recipient = await User.findById(userId);
    if (!recipient) return res.status(400).json({ message: "Invalid user id" });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (!isOwner(task, req.user)) {
      return res.status(403).json({ message: "Only owner can share this task" });
    }
    if (task.sharedWith.map(String).includes(String(userId))) {
      return res.status(400).json({ message: "Task already shared with this user" });
    }

    task.sharedWith.push(userId);
    await task.save();

    const message = `Task "${task.title}" was shared with you`;
    await Notification.create({
      userId,
      type: "share",
      message,
      read: false,
    });
    io.to(String(userId)).emit("notification", { type: "share", message });

    res.json({ message: "Task shared successfully", task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
