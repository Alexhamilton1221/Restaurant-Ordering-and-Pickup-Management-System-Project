// HomePage.js
import React from "react";
import "./styles/HomePage.css"; // Import the CSS file for HomePage styling

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="left-bar"></div>
      <div className="content">
        <h1>Welcome to MealMate!</h1>
        {/* Add more content here */}
      </div>
      <div className="right-bar"></div>
    </div>
  );
};

export default HomePage;
