import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import HomePage from "./components/HomePage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/login" element={<Login />} />
          <Route path="/homepage" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
