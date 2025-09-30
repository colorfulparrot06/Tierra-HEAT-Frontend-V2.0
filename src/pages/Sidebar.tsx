// src/components/Sidebar.tsx
import React from "react";
import "./Sidebar.css";

type SidebarProps = {
  active?: string;
};

const items = [
  "Purpose",
  "Overview",
  "Design Components",
  "Energy Model & Optimization",
  "Location Analysis",
  "Budget Requirements",
];

const Sidebar: React.FC<SidebarProps> = ({ active }) => {
  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">Simulation Settings</h3>
      <ul className="sidebar-menu">
        {items.map((it) => (
          <li
            key={it}
            className={`sidebar-item ${active === it ? "active" : ""}`}
          >
            {it}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
