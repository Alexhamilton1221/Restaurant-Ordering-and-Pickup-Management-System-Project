import React from "react";
import Button from "./Button"; // Import the Button component
import "./Header.css"; // Import the Header CSS file

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            MealMate
          </a>
          <div className="header-buttons">
            {" "}
            {/* Add the header-buttons class */}
            <Button color="blue" text="Login" />{" "}
            {/* Pass the desired color and text */}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
