import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; 


export const getSemesters = () => axios.get(`${API_BASE_URL}/semesters`);

export const addSubject = (semesterNumber, name) =>
  axios.post(`${API_BASE_URL}/subjects`, { semesterNumber, name });


export const editSubject = (semesterNumber, subjectId, newName) =>
  axios.put(`${API_BASE_URL}/subjects/${subjectId}`, {
    semesterNumber: Number(semesterNumber),  
    newName: newName.trim()
  });


export const deleteSubject = (subjectId) =>
  axios.delete(`${API_BASE_URL}/subjects/${subjectId}`);



export const uploadFile = (formData) => {
  return axios.post(`${API_BASE_URL}/upload-subject-file`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", 
    },
  });
};


export const removeFile = (subjectId, fileUrl, fileType) => {
  return axios.delete(`${API_BASE_URL}/delete-subject-file`, {
    data: { subjectId, fileUrl, fileType }, // ✅ DELETE requests require `data` instead of body
  });
};

