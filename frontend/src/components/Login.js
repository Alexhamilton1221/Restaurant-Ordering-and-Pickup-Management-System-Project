import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css"; // Import the Header CSS file
import Button from "./Button"; // Import the Button component

const Login = () => {
  const navigate = useNavigate(); // Use useNavigate hook to navigate

  // Function to handle login button click
  const handleLogin = () => {
    // Navigate to the desired page after login, e.g., homepage
    navigate("/homepage");
  };

  return (
    <div>
      {/* Login form or content */}
      <Button color="blue" text="Login" onClick={handleLogin} />
      {/* Styled login button using Button component */}
    </div>
  );
};

export default Login;
