import React from "react";
import "./styles/Button.css"; // Import the CSS file

const Button = ({ color, text, onClick, cssFile }) => {
  const buttonClass = `button ${color}`;

  return (
    <button className={buttonClass} onClick={onClick} type="button">
      {text}
    </button>
  );
};

export default Button;
