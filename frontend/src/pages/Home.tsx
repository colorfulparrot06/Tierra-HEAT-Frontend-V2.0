import React from "react";
import {
  Budget,
  Location,
  Purpose,
  ExistingSystems,
  Configurations,
  Goals,
  GenerateModelButton,
} from "./Sections";

const Home: React.FC = () => {
  return (
    <div className="home">
      <Budget />
      <Location />
      <Purpose />
      <ExistingSystems />
      <Configurations />
      <Goals />
      <GenerateModelButton />
    </div>
  );
};

export default Home;
