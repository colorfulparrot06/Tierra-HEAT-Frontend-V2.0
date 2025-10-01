// src/pages/GenModel.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import GenModelSidebar from '../components/GenModelSidebar';
import Overview from './genmodel/overview';
import Configurations from './genmodel/configurations';
import TwoDModel from './genmodel/2d-model';
import LocationAnalysis from './genmodel/location-analysis';
import FinancialAnalysis from './genmodel/financial-analysis';
import EnergyOptimization from './genmodel/energy-optimization';
import '../styles/GenModel.css';

const GenModel: React.FC = () => {
  return (
    <div className="genmodel-page">
      {/* Sidebar specific to GenModel pages */}
      <div className="genmodel-sidebar">
        <GenModelSidebar />
      </div>

      {/* Main content area */}
      <main className="genmodel-main">
        <Routes>
          <Route path="/" element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="configurations" element={<Configurations />} />
          <Route path="2d-model" element={<TwoDModel />} />
          <Route path="location-analysis" element={<LocationAnalysis />} />
          <Route path="financial-analysis" element={<FinancialAnalysis />} />
          <Route path="energy-optimization" element={<EnergyOptimization />} />
        </Routes>
      </main>
    </div>
  );
};

export default GenModel;
