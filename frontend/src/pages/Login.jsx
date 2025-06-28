import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin-style.css"; // Ensure CSS exists

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/admin"); // ✅ Redirect to Admin Panel
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("❌ Network Error");
    }
  };

  return (
    <div className="page-container">
      {/* ✅ Header */}
      <header className="logo-container">
        <img src="/CollegeLogo.png" alt="College Logo" className="college-logo" />
      </header>

      {/* ✅ Navbar */}
      <nav >
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="https://www.siet.ac.in/#whysrishakthi" target="_blank" rel="noopener noreferrer">About</a></li>
          <li><a href="https://www.siet.ac.in/student-clubs" target="_blank" rel="noopener noreferrer">Life@Srishakthi</a></li>
          {!localStorage.getItem("token") && <li><a href="/login">Admin Login</a></li>}
        </ul>
      </nav>

      {/* ✅ Login Box */}
      <main >
        <div className="login-container">
          <div className="login-box">
            <h2>Admin Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      </main>

      {/* ✅ Footer */}
      <footer>
        <div className="footer-container">
          <div className="left">
            <p>&copy; 2024 Sri Shakthi Institute of Engineering and Technology</p>
            <p>Approved by AICTE, New Delhi | Affiliated to Anna University, Chennai</p>
            <p>Accredited by NBA & NAAC with A Grade</p>
            <p>Project work by: HARINI (23CS035)</p>
            <p>KARTHIKHA SHREE (23CS046)</p>
          </div>
          <div className="right">
            <p>Sri Shakthi Nagar, Coimbatore</p>
            <p>Principal Email: <a href="mailto:principal@siet.ac.in">principal@siet.ac.in</a></p>
            <p>Phone: +91 422 2369900 | +91 75041 69999</p>
            <p>Admissions: <a href="mailto:admissions@siet.ac.in">admissions@siet.ac.in</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
