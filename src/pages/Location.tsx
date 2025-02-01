import React from "react";
import "../styles/Location.css";

const Location = () => {
  return (
    <div className="section" id="location">
      <p className="section-text">
        Please type in your complete address in the box below.
      </p>
      <div className="input-container">
        <input
          type="text"
          className="location-input"
          placeholder="Enter your location here"
        />
        <span className="question-icon">?</span>
      </div>
      <button className="save-btn">Save</button>
    </div>
  );
};

export default Location;
