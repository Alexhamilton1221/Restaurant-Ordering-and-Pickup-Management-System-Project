import React from "react";
import "./Button.css"; // Import the CSS file

const Button = ({ color, text, onClick }) => {
  const buttonClass = `button ${color}`;

  return (
    <button className={buttonClass} onClick={onClick} type="button">
      {text}
    </button>
  );
};

export default Button;
