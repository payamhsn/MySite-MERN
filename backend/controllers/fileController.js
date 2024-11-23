import asyncHandler from "express-async-handler";
import File from "../models/fileModel.js";
import fs from "fs";
import path from "path";

const getFiles = asyncHandler(async (req, res) => {
  const files = await File.find({ user: req.user._id });
  res.json(files);
});

const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded or file size exceeds limit");
  }

  const file = await File.create({
    user: req.user._id,
    filename: req.file.filename,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    path: req.file.path,
    size: req.file.size,
  });

  res.status(201).json(file);
});

const deleteFile = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id);

  if (!file) {
    res.status(404);
    throw new Error("File not found");
  }

  if (file.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  // Delete file from filesystem
  fs.unlink(file.path, async (err) => {
    if (err) {
      res.status(500);
      throw new Error("Error deleting file from filesystem");
    }
    await File.deleteOne({ _id: req.params.id });
    res.json({ message: "File removed" });
  });
});

const downloadFile = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id);

  if (!file) {
    res.status(404);
    throw new Error("File not found");
  }

  if (file.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  res.download(file.path, file.originalname);
});

// Count files
// GET /api/files/count
// Private

const countFiles = asyncHandler(async (req, res) => {
  const count = await File.countDocuments({ user: req.user._id });
  res.json({ count });
});

export { getFiles, countFiles, uploadFile, deleteFile, downloadFile };
