import React from "react";
import "../styles/Preferences.css";

const Configurations = () => {
  return (
    <div className="section" id="configurations">
      <p className="section-text">
        Please enter any specific configurations or technical preferences for
        your Solar Assisted Geothermal Source Heat Pump.
      </p>
      <div className="input-container">
        <textarea
          className="config-textarea"
          placeholder="Enter your preferences here"
        />
      </div>
      <button className="save-btn">Save</button>
    </div>
  );
};

export default Configurations;
