import "../styles/Purpose.css";

import React from "react";

const Purpose = () => {
  return (
    <div className="section" id="purpose">
      <p className="section-text">
        Please select your purpose for using a Solar Assisted Geothermal Source
        Heat Pump from the options below:
      </p>
      <div className="radio-container">
        <label>
          <input type="radio" name="purpose" value="study-research" />
          Study/Research
        </label>
        <label>
          <input type="radio" name="purpose" value="Single-Family Homes" />
          Single-Family Homes
        </label>
        <label>
          <input type="radio" name="purpose" value="Multi-Family Homes" />
          Multi-Family Homes
        </label>
        <label>
          <input type="radio" name="purpose" value="Commercial Buildings" />
          Commercial Buildings
        </label>
        <label>
          <input type="radio" name="purpose" value="Industrial Buildings" />
          Industrial Buildings
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

export default Purpose;
