import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Header.css"; // Import the Header CSS file
import Button from "./Button"; // Import the Button component

const Header = () => {
  const navigate = useNavigate(); // Use useNavigate hook to navigate

  // Function to handle login button click
  const handleLogin = () => {
    // Navigate to the homepage
    console.log("lets move");
    navigate("/homepage");
  };

  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            MealMate
          </a>
          <Button color="blue" text="Login" onClick={handleLogin} />
          {/* Styled login button using Button component */}
        </div>
      </nav>
    </header>
  );
};

export default Header;
