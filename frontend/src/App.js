import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import Login from "./components/pages/LoginPage";
import HomePage from "./components/pages/HomePage";
import Menu from "./components/pages/Menu";
import ManagerPage from "./components/pages/Manager_Page";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/manager_page" element={<ManagerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
