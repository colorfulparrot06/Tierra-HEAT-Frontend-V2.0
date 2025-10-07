import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import GenModelSidebar from "./components/GenModelSidebar";
import Topbar from "./components/Topbar";
import Home from "./pages/Home";
import GenModel from "./pages/GenModel";
import Overview from "./pages/genmodel/overview";
import Configurations from "./pages/genmodel/configurations";
import TwoDModel from "./pages/genmodel/Model";
import LocationAnalysis from "./pages/genmodel/location-analysis";
import FinancialAnalysis from "./pages/genmodel/financial-analysis";
import EnergyOptimization from "./pages/genmodel/energy-optimization";
import "./App.css";

// Import the context provider
import { UserInputProvider } from "./context/UserInputContext";

const App: React.FC = () => {
  return (
    // Wrap the entire app with UserInputProvider
    <UserInputProvider>
      <div className="app">
        <Topbar />

      <div className="main-content">
        <Routes>
          {/* Initial/Home page with the default sidebar */}
          <Route
            path="/"
            element={
              <>
                <Sidebar />
                <Home />
              </>
            }
          />

            {/* GenModel pages with their own sidebar */}
            <Route path="/genmodel/*" element={<GenModelLayout />} />
          </Routes>
        </div>
      </div>
    </UserInputProvider>
  );
};

export default App;

/* --- Layout component for GenModel pages --- */
const GenModelLayout: React.FC = () => {
  return (
    <div className="genmodel-layout">
      <GenModelSidebar />
      <div className="genmodel-content">
        <Routes>
          {/* Redirect /genmodel to /genmodel/overview */}
          <Route path="/" element={<Navigate to="overview" />} />
          <Route path="overview" element={<Overview />} />
          <Route path="configurations" element={<Configurations />} />
          <Route path="2d-model" element={<TwoDModel />} />
          <Route path="location-analysis" element={<LocationAnalysis />} />
          <Route path="financial-analysis" element={<FinancialAnalysis />} />
          <Route path="energy-optimization" element={<EnergyOptimization />} />
        </Routes>
      </div>
    </div>
  );
};
