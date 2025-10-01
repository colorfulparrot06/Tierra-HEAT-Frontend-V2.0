import React from "react";
import "../styles/Topbar.css";

const Topbar: React.FC = () => {
  return (
    <div className="topbar">
      <div className="topbar-title">Tierra Heat Simulations</div>
      <button className="topbar-button">Get Started</button>
    </div>
  );
};

export default Topbar;
