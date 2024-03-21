// Login.js
import React, { useState } from "react";
import "./styles/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Construct the request body
    const requestBody = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch("your-backend-api-url/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // Successful login
        console.log("Login successful!");
        // Redirect to homepage or perform other actions as needed
      } else {
        // Failed login
        console.error("Login failed.");
        // Handle error or display error message to user
      }
    } catch (error) {
      console.error("Error occurred:", error);
      // Handle error or display error message to user
    }
  };

  return (
    <div className="login-page">
      {/* Login form */}
      <form className="login-form" onSubmit={handleLogin}>
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
  );
};

export default Login;
