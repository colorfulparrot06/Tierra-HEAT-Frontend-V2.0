import "../styles/Sidebar.module.css";
import React from "react";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="navigation">
        <div className="navigation1">Navigation</div>
        <div className="nav-item">
          <a href="#budget">Budget</a>
          <a href="#location">Location</a>
          <a href="#purpose">Purpose</a>
          <a href="#existing-systems">Existing Systems</a>
          <a href="#configurations">Configurations & Preferences</a>
          <a href="#goals">Goals & Details</a>
          <a href="#generate-model">Generate Model</a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
