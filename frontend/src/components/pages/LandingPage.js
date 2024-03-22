import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css"; // Import the LandingPage CSS file
import Button from "../Button"; // Import the Button component

const LandingPage = () => {
  const navigate = useNavigate(); // Use useNavigate hook to navigate

  // Function to handle login button click
  const handleLogin = () => {
    // Navigate to the homepage
    console.log("lets move");
    navigate("/login");
  };

  return (
    <div>
      <header className="header">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              MealMate
            </a>
            <Button
              color="blue"
              text="Login"
              onClick={handleLogin}
              cssClass="header-buttons" // Pass the CSS class name
            />
            {/* Styled login button using Button component */}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default LandingPage;
