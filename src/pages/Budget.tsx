import React from "react";
import "../styles/Budget.css";

const Budget = () => {
  return (
    <div className="section" id="budget">
      <p className="section-text">
        Please enter your preferred budget or price range for your Solar
        Assisted Geothermal Source Heat Pump in the box below. Refer to the
        question mark on the top right corner for more information and details
        on pricing for SAGSHPs.
      </p>
      <input
        type="text"
        className="budget-input"
        placeholder="Enter your budget here"
      />
      <span className="question-icon">?</span>
      <button className="save-btn">Save</button>
    </div>
  );
};

export default Budget;
