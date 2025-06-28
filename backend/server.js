const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const uploadRoutes = require("./routes/uploadRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const authRoutes = require("./routes/authRoutes"); // ✅ Import Authentication Routes
const Semester = require("./models/Semester"); // ✅ Import Semester Model

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Support form-data requests
app.use(cors());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI) // ✅ Remove deprecated options
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Routes
app.use("/api", uploadRoutes);
app.use("/api", subjectRoutes);
app.use("/api", authRoutes); // ✅ Ensure Authentication Routes are active

// ✅ Fetch all semesters
app.get("/api/semesters", async (req, res) => {
  try {
    const semesters = await Semester.find(); // ✅ Ensure `Semester` is imported
    res.json(semesters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
