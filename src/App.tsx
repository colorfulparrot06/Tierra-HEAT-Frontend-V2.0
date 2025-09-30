// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom"; 
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Home from "./pages/Home";
import GenModel from "./pages/GenModel"; 
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app">
      <Topbar />

      <div className="main-content">
        <Sidebar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/genmodel" element={<GenModel />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
