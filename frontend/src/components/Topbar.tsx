import React from "react";
import "../styles/Topbar.css";
import { useNavigate } from "react-router-dom";

const Topbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <div className="topbar-title">Tierra Heat Simulations</div>
      <button className="topbar-button" onClick={() => navigate("/")}>
        Home
      </button>{" "}
    </div>
  );
};

export default Topbar;
