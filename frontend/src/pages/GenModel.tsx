// src/pages/GenModel.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import GenModelSidebar from "../components/GenModelSidebar";
import Overview from "./genmodel/overview";
import Configurations from "./genmodel/configurations";
import Model from "./genmodel/Model";
import LocationAnalysis from "./genmodel/location-analysis";
import FinancialAnalysis from "./genmodel/financial-analysis";
import EnergyOptimization from "./genmodel/energy-optimization";
import "../styles/GenModel.css";

const GenModel: React.FC = () => {
  return (
    <div className="genmodel-page" style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar specific to GenModel pages */}
      <GenModelSidebar />

      {/* Main content area */}
      <main className="genmodel-main" style={{ flex: 1, padding: "20px" }}>
        <Routes>
          {/* Redirect /genmodel to /genmodel/overview */}
          <Route path="/" element={<Navigate to="overview" />} />

          {/* GenModel subpages */}
          <Route path="overview" element={<Overview />} />
          <Route path="configurations" element={<Configurations />} />
          <Route path="2d-model" element={<Model />} />
          <Route path="location-analysis" element={<LocationAnalysis />} />
          <Route path="financial-analysis" element={<FinancialAnalysis />} />
          <Route path="energy-optimization" element={<EnergyOptimization />} />
        </Routes>
      </main>
    </div>
  );
};

export default GenModel;
