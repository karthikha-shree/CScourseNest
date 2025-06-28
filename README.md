# 📚 College Department StudyMaterial Management System

A full-stack MERN (MongoDB, Express.js, React, Node.js) application that allows admins to manage academic files (Syllabus, Notes, CIAT & Semester Question Papers) for multiple departments, regulations, and semesters, while allowing students to browse them without needing to log in.

---


## ✨ Key Features

### 👨‍🏫 Admin Panel
*   **Secure Authentication:** Admins must log in to access the management dashboard.
*   **Dynamic Hierarchy Creation:**
    *   Add, edit, and delete **Departments**.
    *   Add and manage **Regulations** for each department.
    *   Semesters (1 through 8) are automatically generated for each new regulation.
*   **Subject Management:** Add, edit, and delete subjects within a specific semester.
*   **Cloud File Management:**
    *   Upload files directly to **Cloudinary**.
    *   Organize files under four distinct categories:
        *   📘 Syllabus
        *   📝 Notes
        *   🧠 CIAT Question Papers
        *   📄 Semester Question Papers
    *   Delete files from the server and Cloudinary.

### 👨‍🎓 Student & Public View
*   **No Login Required:** All academic files are publicly accessible for easy browsing.
*   **Intuitive Navigation:** Users can easily navigate through the hierarchy:
    *   `Department` → `Regulation` → `Semester` → `Subject` → `Files`
*   **In-Browser Viewer:** View PDFs and other documents directly in the browser without needing to download them.

---

## 🛠️ Tech Stack

| Category       | Technology                                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| **Frontend**   | [React](https://reactjs.org/), [React Router](https://reactrouter.com/)                               |
| **Backend**    | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)                                  |
| **Database**   | [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)                           |
| **File Storage** | [Cloudinary](https://cloudinary.com/)                                                                  |
| **Authentication** | [JSON Web Tokens (JWT)](https://jwt.io/)                                                               |

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v14 or newer) & npm
*   [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a MongoDB Atlas connection string.
*   A [Cloudinary](https://cloudinary.com/) account to get API credentials.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/college-question-bank.git
    cd college-question-bank
    ```

2.  **Set up the Backend:**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `/backend` directory and add the following environment variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    JWT_SECRET=a_very_strong_and_secret_key_for_jwt
    ```
    Start the backend server:
    ```bash
    npm start
    ```
    The server will run on `http://localhost:5000`.

3.  **Set up the Frontend:**
    Open a new terminal window.
    ```bash
    cd frontend
    npm install
    ```
    Start the frontend development server:
    ```bash
    npm run dev
    ```
    The React app will be available at `http://localhost:5173` (or another port if 5173 is busy).

### 🔐 Admin Login Credentials

For initial setup, the admin credentials can be configured in `/backend/routes/authRoutes.js`. It is highly recommended to move this to a more secure system or a seeded database entry.

```javascript
// Example from /backend/routes/authRoutes.js
const ADMIN_USER = {
  email: 'your-email@example.com',
  password: 'hashed-or-plain-text-password' // Hashing is recommended!
};
```

---

## 📁 Project Structure

```
college-question-bank/
├── backend/
│   ├── models/
│   │   ├── Department.js
│   │   ├── Regulation.js
│   │   ├── Semester.js
│   │   └── Subject.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── departmentRoutes.js
│   │   └── subjectRoutes.js
│   ├── controllers/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## 🛣️ API Endpoints Overview

### 🔒 Admin Routes (Protected)

| Method | Endpoint                     | Description                                    |
| :----- | :--------------------------- | :--------------------------------------------- |
| `POST` | `/api/auth/login`            | Authenticate admin and return a JWT.           |
| `POST` | `/api/departments`           | Add a new department.                          |
| `POST` | `/api/subjects`              | Add a new subject to a semester.               |
| `PUT`  | `/api/subjects/:id`          | Update an existing subject.                    |
| `DELETE`| `/api/subjects/:id`          | Delete a subject.                              |
| `POST` | `/api/upload-subject-file`   | Upload a file (Syllabus, Notes, etc.).         |
| `DELETE`| `/api/delete-subject-file` | Delete a file from a subject and Cloudinary. |

### 🌐 Public Routes

| Method | Endpoint             | Description                                          |
| :----- | :------------------- | :--------------------------------------------------- |
| `GET`  | `/api/departments`   | Get a list of all departments and their regulations. |
| `GET`  | `/api/semesters`     | Get all semesters and their associated subjects.     |

---

## 🎯 Future Improvements (TODO)

-   [x] JWT-based authentication for admin routes.
-   [x] Full CRUD functionality for Departments, Regulations, and Subjects.
-   [x] Dynamic UI that reflects the backend data structure.
-   [ ] **Search & Filter:** Implement a search bar to quickly find subjects or files.
-   [ ] **Pagination:** Add pagination for long lists of subjects or files.
-   [ ] **File Type Validation:** Restrict file uploads to specific types (e.g., PDF, DOCX).
-   [ ] **User Roles:** Introduce more roles, like "Uploader" or "Moderator," with specific permissions.

---

## 🙌 Acknowledgments

*   Special thanks to **Cloudinary** for their generous free tier for image and file hosting.
*   The project was built with the powerful open-source tools provided by the **React, Node.js, and MongoDB** communities.
