// src/components/GenModelSidebar.tsx
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
  const location = useLocation();

  return (
    <aside className="genmodel-sidebar">
      <div className="sidebar-title">Navigation</div>
      <ul className="sidebar-menu">
        {sidebarItems.map((item) => (
          <li
            key={item.path}
            className={`sidebar-item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            <Link to={item.path}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default GenModelSidebar;
