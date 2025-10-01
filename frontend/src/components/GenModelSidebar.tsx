import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/GenModelSidebar.css";

const sidebarItems = [
  { title: "Overview", path: "/genmodel/overview" },
  { title: "Configurations", path: "/genmodel/configurations" },
  { title: "2D Model", path: "/genmodel/2d-model" },
  { title: "Location Analysis", path: "/genmodel/location-analysis" },
  { title: "Financial Analysis", path: "/genmodel/financial-analysis" },
  { title: "Energy Optimization", path: "/genmodel/energy-optimization" },
];

const GenModelSidebar: React.FC = () => {
  const location = useLocation(); // get current path

  return (
    <aside className="w-64 bg-gray-100 p-4">
      <ul>
        {sidebarItems.map((item) => (
          <li
            key={item.path}
            style={{
              fontWeight: location.pathname === item.path ? "bold" : "normal",
              marginBottom: "10px",
            }}
          >
            <Link to={item.path}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default GenModelSidebar;
