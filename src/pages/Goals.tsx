import React from "react";
import "../styles/Goals.css";
const Goals = () => {
  return (
    <div className="section" id="goals">
      <p className="section-text">
        Please type in your goals and additional details regarding your Solar
        Assisted Geothermal Source Heat Pump system in the box below.
      </p>
      <div className="input-container">
        <textarea
          className="goals-textarea"
          placeholder="Enter your goals and details here"
        />
      </div>
      <button className="save-btn">Save</button>
    </div>
  );
};

export default Goals;
