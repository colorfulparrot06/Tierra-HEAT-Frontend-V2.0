import React from "react";
import Section from "../components/Section";
import ExistingSystems from "./ExistingSystem";
import Preferences from "./Preferences";
import Goals from "./Goals";
import Budget from "./Budget";
import Location from "./Location";
import Purpose from "./Purpose";
import GenerateModel from "./GenerateModel";

const Home: React.FC = () => {
  return (
    <div className="home">
      <Section id="budget" title="Budget">
        <Budget />
      </Section>
      <Section id="location" title="Location">
        <Location />
      </Section>
      <Section id="purpose" title="Purpose">
        <Purpose />
      </Section>
      <Section id="existing-system" title="Existing System">
        <ExistingSystems />
      </Section>
      <Section id="configurations" title="Configurations & Preferences">
        <Preferences />
      </Section>
      <Section id="goals" title="Goals & Details">
        <Goals />
      </Section>
      <Section id="generate-model" title="">
        <GenerateModel />
      </Section>
    </div>
  );
};

export default Home;
