import React from "react";
import "./Header.css"; // Import the Header CSS file

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            MealMate
          </a>
          {/* No button component */}
        </div>
      </nav>
    </header>
  );
};

export default Header;
