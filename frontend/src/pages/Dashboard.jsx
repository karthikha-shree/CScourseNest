import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getSemesters } from "../api/api";
import "../styles/style.css";
import Header from "../components/header";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const Dashboard = () => {
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const { data } = await getSemesters();
      setSemesters(data);
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  return (
    <div>
      <Header />
      <Navbar />

      <h1>DEPARTMENT OF CSE</h1>

      {semesters.map((semester) => (
        <div key={semester.semesterNumber}>
          <h2 className="semester">{semester.semesterName}</h2>
          <table>
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Syllabus</th>
                <th>Notes</th>
                <th>CIAT Question Papers</th>
                <th>Semester Question Papers</th>
              </tr>
            </thead>
            <tbody>
              {semester.subjects.map((subject) => (
                <tr key={subject.name}>
                  <td>{subject.name}</td>
                  <td><a href={subject.syllabus[0] || "#"} target="_blank" rel="noopener noreferrer">Click here!</a></td>
                  <td>
                    {subject.notes.map((note, index) => (
                      <a key={index} href={note} target="_blank" rel="noopener noreferrer">UNIT {index + 1} <br></br> </a>
                    ))}
                  </td>
                  <td>
                    {subject.ciatQuestionPapers.map((ciat, index) => (
                      <a key={index} href={ciat} target="_blank" rel="noopener noreferrer">
                        CIAT {index + 1}<br></br>
                      </a>
                    ))}
                  </td>
                  <td>
                    {subject.semesterQuestionPapers.map((paper, index) => (
                      <a key={index} href={paper} target="_blank" rel="noopener noreferrer">
                        Semester Paper {index + 1}<br></br>
                      </a>
                    ))}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <Footer />
    </div>
  );
};

export default Dashboard;
