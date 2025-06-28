const mongoose = require("mongoose");

const SemesterSchema = new mongoose.Schema({
  semesterNumber: Number,
  semesterName: String,
  subjects: [
    {
      name: String,
      syllabus: [String], // Allow multiple PDFs
      notes: [String], 
      ciatQuestionPapers: [String],
      semesterQuestionPapers: [String], // Allow multiple PDFs
    },
  ],
});

// Prevent overwriting the model if it's already declared
const Semester = mongoose.models.Semester || mongoose.model("Semester", SemesterSchema);

module.exports = Semester;
