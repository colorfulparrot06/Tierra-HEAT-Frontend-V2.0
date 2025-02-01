import React from "react";
import "../styles/ExistingSystem.css";

const ExistingSystems = () => {
  return (
    <div className="section" id="existing-systems">
      <p className="section-text">
        Please choose one of the following existing systems:
      </p>
      <div className="radio-container">
        <label>
          <input type="radio" name="existing-systems" value="open-loop" />
          Open Loop Geothermal System
        </label>
        <label>
          <input type="radio" name="existing-systems" value="closed-loop" />
          Closed Loop Geothermal System
        </label>
        <label>
          <input
            type="radio"
            name="existing-systems"
            value=" Hybrid Geothermal System"
          />
          Hybrid Geothermal System
        </label>
        <label>
          <input
            type="radio"
            name="existing-systems"
            value="Solar Thermal Collectors"
          />
          Solar Thermal Collectors
        </label>
        <label>
          <input type="radio" name="existing-systems" value="PV Panels" />
          PV Panels
        </label>
        <label>
          <input
            type="radio"
            name="existing-systems"
            value="Forced-air Geothermal Heat Pump"
          />
          Forced-air Geothermal Heat Pump
        </label>
        <div className="option">
          <label>
            <input type="radio" name="purpose" value="other" />
            Other
          </label>
          <input
            type="text"
            placeholder="Type here..."
            className="other-input-field"
          />
        </div>
      </div>
      <button className="save-btn">Save</button>
    </div>
  );
};

export default ExistingSystems;
