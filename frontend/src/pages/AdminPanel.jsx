import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaUpload, FaTimes, FaSave, FaFolderOpen, FaSignOutAlt } from "react-icons/fa";
import Header from "../components/header";
import Footer from "../components/footer";

import {
  getSemesters, addSubject, editSubject, deleteSubject, uploadFile, removeFile
} from "../api/api";
import "../styles/admin-style.css";

const AdminPanel = () => {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectName, setSubjectName] = useState("");
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [updatedSubjectName, setUpdatedSubjectName] = useState("");
  const [fileCategory, setFileCategory] = useState("");
  const [file, setFile] = useState(null);

  // ✅ Fetch semesters when component loads
  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const { data } = await getSemesters();
      setSemesters(data);
    } catch (error) {
      console.error("❌ Error fetching semesters:", error);
    }
  };
  useEffect(() => {
    if (selectedSemester) {
      const semester = semesters.find((sem) => sem.semesterNumber === Number(selectedSemester));
      setSubjects(semester ? semester.subjects : []);
    }
  }, [selectedSemester, semesters]);

  // ✅ Handle semester selection
  const handleSemesterSelect = (semesterNumber) => {
    setSelectedSemester(semesterNumber);
    const semester = semesters.find((sem) => sem.semesterNumber === Number(semesterNumber));
    setSubjects(semester ? semester.subjects : []);
    setSelectedSubject(null);
  };

  // ✅ Add Subject
  const handleAddSubject = async () => {
    if (!selectedSemester || !subjectName.trim()) {
      alert("⚠️ Please select a semester and enter a subject name.");
      return;
    }

    try {
      const response = await addSubject(selectedSemester, subjectName);

      // ✅ Update UI Immediately
      setSubjects((prevSubjects) => [
        ...prevSubjects,
        { _id: response.data.semester.subjects.slice(-1)[0]._id, name: subjectName, syllabus: [], notes: [], ciatQuestionPapers: [], semesterQuestionPapers: [] }
      ]);

      setSubjectName(""); // Clear input
    } catch (error) {
      console.error("❌ Error adding subject:", error);
    }
  };


  // ✅ Edit Subject Name
  const handleEditSubject = async (subjectId) => {
    if (!updatedSubjectName.trim()) {
      alert("⚠️ Please enter a valid subject name.");
      return;
    }

    try {
      await editSubject(selectedSemester, subjectId, updatedSubjectName);

      // ✅ Update UI Immediately
      setSubjects((prevSubjects) =>
        prevSubjects.map((subject) =>
          subject._id === subjectId ? { ...subject, name: updatedSubjectName } : subject
        )
      );

      setEditingSubjectId(null);
      setUpdatedSubjectName("");
    } catch (error) {
      console.error("❌ Error updating subject:", error);
    }
  };
  const handleEditClick = (subjectId, currentName) => {
    setEditingSubjectId(subjectId);
    setUpdatedSubjectName(currentName);
  };


  const handleDeleteSubject = async (subjectId) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    try {
      console.log("Deleting Subject ID:", subjectId); // ✅ Debugging log
      await deleteSubject(subjectId); // ❌ Removed selectedSemester (not needed)

      // ✅ Update UI Immediately
      setSubjects((prevSubjects) => prevSubjects.filter((subject) => subject._id !== subjectId));

      console.log("✅ Subject deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting subject:", error);
    }
  };


  // ✅ Handle File Upload
  const handleFileUpload = async () => {
    if (!selectedSubject || !file || !fileCategory) {
      alert("❌ Please select a subject, category, and file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("semesterNumber", selectedSemester);
    formData.append("subjectId", selectedSubject._id);
    formData.append("fileType", fileCategory);

    try {
      console.log("🟢 Uploading file:", { subjectId: selectedSubject._id, fileCategory });

      await uploadFile(formData);

      alert("✅ File uploaded successfully!");

      // ✅ Update UI Immediately by Fetching Latest Data
      const updatedSemester = await getSemesters();
      const updatedSubjects = updatedSemester.data.find(
        (sem) => sem.semesterNumber === Number(selectedSemester)
      ).subjects;

      setSubjects(updatedSubjects);
      setSelectedSubject(updatedSubjects.find((subj) => subj._id === selectedSubject._id));

      setFile(null);
      setFileCategory("");
    } catch (error) {
      console.error("❌ Error uploading file:", error);
      alert("❌ Failed to upload file.");
    }
  };


  // ✅ Handle File Removal
  const handleRemoveFile = async (fileUrl, fileType) => {
    if (!selectedSubject) {
      alert("❌ No subject selected.");
      return;
    }

    if (!window.confirm("Are you sure you want to remove this file?")) return;

    try {
      console.log("🟢 Sending delete request for:", { subjectId: selectedSubject._id, fileUrl, fileType });
      
      await removeFile(selectedSubject._id, fileUrl, fileType);
      alert("✅ File removed successfully!");

      // ✅ Update UI Immediately by Fetching Latest Data
      const updatedSemester = await getSemesters();
      const updatedSubjects = updatedSemester.data.find(
        (sem) => sem.semesterNumber === Number(selectedSemester)
      ).subjects;

      setSubjects(updatedSubjects);
      setSelectedSubject(updatedSubjects.find((subj) => subj._id === selectedSubject._id));

    } catch (error) {
      console.error("❌ Error removing file:", error);
      alert("❌ Failed to remove file.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // ✅ Remove token
    window.location.href = "/login"; // ✅ Redirect to login page
  };


  return (
    <div>
      <Header />


      <div className="admin-panel-container">
        <h2>Admin Panel</h2>

        {/* ✅ Select Semester */}
        <label>Select Semester:</label>
        <select onChange={(e) => handleSemesterSelect(e.target.value)} value={selectedSemester}>
          <option value="">Select Semester</option>
          {semesters.map((sem) => (
            <option key={sem.semesterNumber} value={sem.semesterNumber}>
              {sem.semesterName}
            </option>
          ))}
        </select>

        {/* ✅ Show Subjects */}
        {selectedSemester && (
          <div className="subject-list">
            <h3>AVAILABLE SUBJECTS:</h3>

            <table className="subject-table">
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject._id}>
                    {/* ✅ Subject Name Column */}
                    <td>
                      {editingSubjectId === subject._id ? (
                        <input
                          type="text"
                          value={updatedSubjectName}
                          placeholder={subject.name}
                          onChange={(e) => setUpdatedSubjectName(e.target.value)}
                          style={{ width: "90%" }}
                        />
                      ) : (
                        <span className="subject-name">{subject.name}</span>
                      )}
                    </td>

                    {/* ✅ Actions (Edit, Delete) */}
                    <td className="icon-cell">
                      {editingSubjectId === subject._id ? (
                        <>
                          <FaSave
                            className="icon-btn"
                            onClick={() => handleEditSubject(subject._id)}
                            title="Save"
                          />
                          <FaTimes
                            className="icon-btn"
                            onClick={() => setEditingSubjectId(null)}
                            title="Cancel"
                          />
                        </>
                      ) : (
                        <>
                          <FaEdit
                            className="icon-btn"
                            onClick={() => handleEditClick(subject._id, subject.name)}
                            title="Edit"
                          />
                          <FaTrash
                            className="icon-btn"
                            onClick={() => handleDeleteSubject(subject._id)}
                            title="Delete"
                          />
                        </>
                      )}
                    </td>

                    {/* ✅ Manage Files Icon */}
                    <td className="icon-cell">
                      <FaFolderOpen
                        className="icon-btn"
                        onClick={() => setSelectedSubject(subject)}
                        title="Manage Files"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ✅ Add Subject */}
            <h3>Add New Subject</h3>
            <table className="add-subject-table">
              <tbody>
                <tr>
                  <td>
                    <input
                      type="text"
                      placeholder="Enter Subject Name"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                    />
                  </td>
                  <td className="icon-cell">
                    <FaUpload className="icon-btn" onClick={handleAddSubject} title="Add Subject" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ File Management Section */}
        {selectedSubject && (
          <div className="file-management">
            <h3>Manage Files for {selectedSubject.name}</h3>

            {/* ✅ Upload Files */}
            <div className="file-upload">
              <label>Add Files:</label>
              <select onChange={(e) => setFileCategory(e.target.value)} value={fileCategory}>
                <option value="">Select Category</option>
                <option value="syllabus">Syllabus</option>
                <option value="notes">Notes</option>
                <option value="ciat">CIAT Question Papers</option>
                <option value="semester">Semester Question Papers</option>
              </select>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <div className="upload-icon">
                <FaUpload className="icon-btn" onClick={handleFileUpload} title="Upload" />
              </div>

            </div>

            {/* ✅ Show Existing Files in a Table */}
            <table className="file-table">
              <tbody>
                {["syllabus", "notes", "ciatQuestionPapers", "semesterQuestionPapers"].map((category) => (
                  <React.Fragment key={category}>
                    <tr className="file-category">
                      <td colSpan="2">
                        <strong>{category.replace(/([A-Z])/g, " $1")}</strong>
                      </td>
                    </tr>
                    {selectedSubject[category]?.map((fileUrl, index) => (
                      <tr key={index} className="file-row">
                        <td>
                          <a href={fileUrl} target="_blank" rel="noopener noreferrer">{decodeURIComponent(fileUrl.split("/").pop())} </a>
                        </td>
                        <td className="icon-cell">
                          <FaTrash className="icon-btn" onClick={() => handleRemoveFile(fileUrl, category)} title="Remove" />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="logout-container">logout  :
        <FaSignOutAlt className="logout-icon" onClick={handleLogout} />
      </div>


      <Footer />
    </div>
  );
};

export default AdminPanel;
