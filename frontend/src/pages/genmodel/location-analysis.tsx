import React from "react";
import "../../styles/Output/location-analysis.css";

const LocationAnalysis: React.FC = () => {
  return (
    <div className="location-analysis-section">
      <h2>Location Analysis</h2>
      <div className="location-analysis-content">
        <p>
          This section provides a detailed analysis of the selected location,
          including geographical, environmental, and logistical factors. The
          information here is designed to help in planning and optimizing energy
          systems for the chosen area.
        </p>
      </div>
    </div>
  );
};

export default LocationAnalysis;
