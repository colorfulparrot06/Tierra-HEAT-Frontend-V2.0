import React from "react";
import "../styles/Sections.css";
import { useNavigate } from "react-router-dom";

/* -------------------- Budget -------------------- */
const Budget = () => {
  return (
    <div className="section" id="budget">
      <h2>Budget</h2>
      <div className="section-content">
        <p>
          Please enter your preferred budget or price range for your Solar
          Assisted Geothermal Source Heat Pump in the box below. Refer to the
          question mark on the top right corner for more information and details
          on pricing for SAGSHPs.
        </p>
        <div className="input-container">
          <input
            type="text"
            className="other-input-field"
            placeholder="Enter your budget here"
          />
          {/* questionmark    <span className="question-icon">?</span> */}
        </div>
        <button className="save-btn">Save</button>
      </div>
    </div>
  );
};

/* -------------------- Existing Systems -------------------- */
const ExistingSystems = () => {
  return (
    <div className="section" id="existing-systems">
      <h2>Existing Systems</h2>
      <div className="section-content">
        <p>
          Please choose one of the following existing systems that might already
          exist in this location. If your system is not listed as an option
          below or you have a combination of various systems, please type in the
          other section and detail the existing system that is in place.
        </p>
        <div className="radio-rectangle-group">
          <label className="radio-rectangle">
            <input type="radio" name="existing-systems" value="open-loop" />
            Open Loop Geothermal System
          </label>
          <label className="radio-rectangle">
            <input type="radio" name="existing-systems" value="closed-loop" />
            Closed Loop Geothermal System
          </label>
          <label className="radio-rectangle">
            <input type="radio" name="existing-systems" value="hybrid" />
            Hybrid Geothermal System
          </label>
          <label className="radio-rectangle">
            <input type="radio" name="existing-systems" value="solar-thermal" />
            Solar Thermal Collectors
          </label>
          <label className="radio-rectangle">
            <input type="radio" name="existing-systems" value="pv-panels" />
            PV Panels
          </label>
          <label className="radio-rectangle">
            <input type="radio" name="existing-systems" value="forced-air" />
            Forced-air Geothermal Heat Pump
          </label>
          <label className="radio-rectangle">
            <input type="radio" name="existing-systems" value="other" />
            Other
          </label>
          <input
            type="text"
            className="other-input-field"
            placeholder="Type here..."
          />
        </div>
      </div>
    </div>
  );
};

/* -------------------- Goals -------------------- */
const Goals = () => {
  return (
    <div className="section" id="goals">
      <h2>Goals</h2>
      <div className="section-content">
        <p>
          Please enter any specific goals or design detials that you would like
          to include for your SAGSHP. (Optional)
        </p>
        <textarea
          className="other-input-field"
          placeholder="Enter your goals here"
        />
        <button className="save-btn">Save</button>
      </div>
    </div>
  );
};

/* -------------------- Location -------------------- */
const Location = () => {
  return (
    <div className="section" id="location">
      <h2>Location</h2>
      <div className="section-content">
        <p>Please type in your complete address in the box below.</p>
        <div className="input-container">
          <input
            type="text"
            className="other-input-field"
            placeholder="Enter your location here"
          />
          {/*} <span className="question-icon">?</span> */}
        </div>
        <button className="save-btn">Save</button>
      </div>
    </div>
  );
};

/* -------------------- Configurations -------------------- */
const Configurations = () => {
  return (
    <div className="section" id="configurations">
      <h2>Configurations</h2>
      <div className="section-content">
        <p>
          Please enter any specific configurations or technical preferences that
          you have for your system. Please also consider including any other
          specific systems or structures you would like to have as part of your
          design. (Optional)
        </p>
        <textarea
          className="other-input-field"
          placeholder="Enter your preferences here"
        />
        <button className="save-btn">Save</button>
      </div>
    </div>
  );
};

/* -------------------- Purpose -------------------- */
const Purpose = () => {
  return (
    <div className="section" id="purpose">
      <h2>Purpose</h2>
      <div className="section-content">
        <p>
          Please choose one of the options below or enter your own usage in the
          text box.
        </p>
        <div className="radio-rectangle-group">
          <label className="radio-rectangle">
            <input type="radio" name="purpose" value="study-research" />
            Study/Research
          </label>
          <label className="radio-rectangle">
            <input type="radio" name="purpose" value="single-family" />
            Single-Family Homes
          </label>
          <label className="radio-rectangle">
            <input type="radio" name="purpose" value="multi-family" />
            Multi-Family Homes
          </label>
          <label className="radio-rectangle">
            <input type="radio" name="purpose" value="commercial" />
            Commercial Buildings
          </label>
          <label className="radio-rectangle">
            <input type="radio" name="purpose" value="industrial" />
            Industrial Buildings
          </label>
          <label className="radio-rectangle">
            <input type="radio" name="purpose" value="other" />
            Other
          </label>
          <input
            type="text"
            className="other-input-field"
            placeholder="Type here..."
          />
        </div>
      </div>
    </div>
  );
};

/* -------------------- Generate Model Button -------------------- */

const GenerateModelButton: React.FC = () => {
  const navigate = useNavigate();

  const goToGenModel = () => {
    navigate("/genmodel");
  };

  return (
    <div className="section">
      <div className="generateButton">
        <button className="save-btn" onClick={goToGenModel}>
          Generate Model
        </button>
      </div>
    </div>
  );
};

export {
  Budget,
  ExistingSystems,
  Goals,
  Location,
  Configurations,
  Purpose,
  GenerateModelButton,
};
