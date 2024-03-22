// Login.js
import "./styles/Login.css";
import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/auth/login", {
        username,
        password,
      });

      console.log("Login successful:", response.data);
      // Redirect to homepage or perform other actions upon successful login
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login failure, e.g., display error message to the user
    }
  };

  return (
    <div className="login-page">
      <div className="left-bar"></div>
      <div className="content">
        <h1>Welcome to MealMate!</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button">
            Enter
          </button>
        </form>
      </div>
      <div className="right-bar"></div>
    </div>
  );
};

export default Login;
