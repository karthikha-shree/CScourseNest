const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const router = express.Router();

// Multer Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "student_dashboard", // Change the folder name if needed
    format: async (req, file) => "pdf", // You can change format type
  },
});

const upload = multer({ storage });

// Upload Route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const fileUrl = req.file.path;
    res.status(200).json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
