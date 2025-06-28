const express = require("express");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const Semester = require("../models/Semester");

const router = express.Router();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "semester_files",
    resource_type: "raw",
    format: async () => "pdf",
    public_id: (req, file) => `${Date.now()}-${file.originalname.split(".")[0]}`, // Unique file names
  },
});

const upload = multer({ storage });
/* ======================================
 ✅ UPLOAD FILE & LINK TO SUBJECT
====================================== */
router.post("/upload-subject-file", upload.single("file"), async (req, res) => {
  try {
    console.log("🟢 Incoming Request Data:", req.body);

    const { semesterNumber, subjectId, fileType } = req.body;

    if (!req.file) {
      console.log("❌ No file uploaded");
      return res.status(400).json({ message: "❌ No file uploaded" });
    }
    if (!semesterNumber || !subjectId || !fileType) {
      console.log("❌ Missing required fields:", { semesterNumber, subjectId, fileType });
      return res.status(400).json({ message: "❌ Missing required fields" });
    }

    const fileUrl = req.file.path;
    console.log("✅ File uploaded to Cloudinary:", fileUrl);

    let semester = await Semester.findOne({ semesterNumber });
    if (!semester) {
      console.log("❌ Semester not found:", semesterNumber);
      return res.status(404).json({ message: "❌ Semester not found" });
    }

    let subject = semester.subjects.id(subjectId);
    if (!subject) {
      console.log("❌ Subject not found:", subjectId);
      return res.status(404).json({ message: "❌ Subject not found" });
    }

    // ✅ Assign file to the correct category
    if (fileType === "syllabus") subject.syllabus.push(fileUrl);
    else if (fileType === "notes") subject.notes.push(fileUrl);
    else if (fileType === "ciat") subject.ciatQuestionPapers.push(fileUrl);
    else if (fileType === "semester") subject.semesterQuestionPapers.push(fileUrl);
    else {
      console.log("❌ Invalid file type:", fileType);
      return res.status(400).json({ message: "❌ Invalid file type" });
    }

    await semester.save();
    res.json({ message: "✅ File uploaded successfully!", fileUrl });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Server error while uploading file." });
  }
});
/* ======================================
 ✅ ADD NEW SUBJECT
====================================== */
router.post("/subjects", async (req, res) => {
  try {
    const { semesterNumber, name } = req.body;

    let semester = await Semester.findOne({ semesterNumber });
    if (!semester) return res.status(404).json({ message: "❌ Semester not found" });

    semester.subjects.push({
      name,
      syllabus: [],
      notes: [],
      ciatQuestionPapers: [],
      semesterQuestionPapers: [],
    });

    await semester.save();
    res.json({ message: "✅ Subject added successfully", semester });
  } catch (error) {
    console.error("❌ Error adding subject:", error);
    res.status(500).json({ message: "Server error while adding subject." });
  }
});

/* ======================================
 ✅ EDIT SUBJECT NAME
====================================== */
router.put("/subjects/:id", async (req, res) => {
  try {
    const { newName } = req.body;

    let semester = await Semester.findOne({ "subjects._id": req.params.id });
    if (!semester) return res.status(404).json({ message: "❌ Semester not found" });

    let subject = semester.subjects.id(req.params.id);
    if (!subject) return res.status(404).json({ message: "❌ Subject not found" });

    subject.name = newName;
    await semester.save();

    res.json({ message: "✅ Subject updated successfully!", subject });
  } catch (error) {
    console.error("❌ Error updating subject:", error);
    res.status(500).json({ message: "Server error while updating subject." });
  }
});

/* ======================================
 ✅ DELETE SUBJECT
====================================== */
router.delete("/subjects/:id", async (req, res) => {
  try {
    console.log("🛠️ Deleting Subject with ID:", req.params.id); // Debugging log

    let semester = await Semester.findOne({ "subjects._id": req.params.id });
    if (!semester) return res.status(404).json({ message: "❌ Semester not found" });

    const initialSubjectCount = semester.subjects.length; // Track before deletion
    semester.subjects = semester.subjects.filter(subj => subj._id.toString() !== req.params.id);

    if (semester.subjects.length === initialSubjectCount) {
      return res.status(404).json({ message: "❌ Subject not found in semester" });
    }

    await semester.save();
    console.log("✅ Subject Deleted Successfully!");

    res.json({ message: "✅ Subject deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting subject:", error);
    res.status(500).json({ message: "Server error while deleting subject." });
  }
});

/* ======================================
 ✅ REMOVE FILE FROM SUBJECT & CLOUDINARY
====================================== */
router.delete("/delete-subject-file", async (req, res) => {
  try {
    console.log("🔹 Incoming Request:", req.body); // Debug log

    const { subjectId, fileUrl, fileType } = req.body;

    if (!subjectId || !fileUrl || !fileType) {
      return res.status(400).json({ message: "❌ Missing required fields" });
    }

    let semester = await Semester.findOne({ "subjects._id": subjectId });
    if (!semester) {
      console.log("❌ Semester not found for subjectId:", subjectId);
      return res.status(404).json({ message: "❌ Semester not found" });
    }

    let subject = semester.subjects.id(subjectId);
    if (!subject) {
      console.log("❌ Subject not found in semester:", subjectId);
      return res.status(404).json({ message: "❌ Subject not found" });
    }

    console.log("✅ Subject Found:", subject.name);

    // ✅ Remove File from Subject
    if (fileType === "syllabus") {
      subject.syllabus = subject.syllabus.filter(file => file !== fileUrl);
    } else if (fileType === "notes") {
      subject.notes = subject.notes.filter(file => file !== fileUrl);
    } else if (fileType === "ciatQuestionPapers") {
      subject.ciatQuestionPapers = subject.ciatQuestionPapers.filter(file => file !== fileUrl);
    } else if (fileType === "semesterQuestionPapers") {
      subject.semesterQuestionPapers = subject.semesterQuestionPapers.filter(file => file !== fileUrl);
    } else {
      return res.status(400).json({ message: "❌ Invalid file type" });
    }

    // ✅ Remove file from Cloudinary
    const publicId = fileUrl.split("/").pop().split(".")[0];
    console.log("🔹 Deleting file from Cloudinary:", publicId);
    await cloudinary.uploader.destroy(`semester_files/${publicId}`, { resource_type: "raw" });

    await semester.save();
    res.json({ message: "✅ File removed successfully" });
  } catch (error) {
    console.error("❌ Error removing file:", error);
    res.status(500).json({ message: "Server error while removing file." });
  }
});

module.exports = router;
