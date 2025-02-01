import React from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Home from "./pages/Home";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app">
      <Topbar />
      <div className="main-content">
        <Sidebar />
        <Home />
      </div>
    </div>
  );
};

export default App;
