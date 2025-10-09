// src/context/UserInputContext.tsx
import React, { createContext, useState, ReactNode } from "react";

// Define the data structure of all user inputs
interface UserInputContextType {
  lat: number | null;
  lon: number | null;
  budgetMin: number | null;
  budgetMax: number | null;
  simulations: number;
  variation: number;
  setLocation: (input: string) => void; // takes "lat,lon" string
  setBudgetRange: (min: number, max: number) => void;
  setSimulations: (count: number) => void;
  setVariation: (percent: number) => void;
}

// Default values for context
export const UserInputContext = createContext<UserInputContextType>({
  lat: null,
  lon: null,
  budgetMin: null,
  budgetMax: null,
  simulations: 1000,
  variation: 0.1, // ±10%
  setLocation: () => {},
  setBudgetRange: () => {},
  setSimulations: () => {},
  setVariation: () => {},
});

export const UserInputProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [budgetMin, setBudgetMin] = useState<number | null>(null);
  const [budgetMax, setBudgetMax] = useState<number | null>(null);
  const [simulations, setSimulationsState] = useState<number>(1000);
  const [variation, setVariationState] = useState<number>(0.1); // 10%

  // Parse "lat,lon" input
  const setLocation = (input: string) => {
    const [latStr, lonStr] = input.split(",");
    const parsedLat = parseFloat(latStr.trim());
    const parsedLon = parseFloat(lonStr.trim());

    if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
      setLat(parsedLat);
      setLon(parsedLon);
    } else {
      console.error("Invalid location input. Please use format: lat,lon");
    }
  };

  // Budget range setter
  const setBudgetRange = (min: number, max: number) => {
    setBudgetMin(min);
    setBudgetMax(max);
  };

  const setSimulations = (count: number) => {
    setSimulationsState(count);
  };

  const setVariation = (percent: number) => {
    setVariationState(percent);
  };

  return (
    <UserInputContext.Provider
      value={{
        lat,
        lon,
        budgetMin,
        budgetMax,
        simulations,
        variation,
        setLocation,
        setBudgetRange,
        setSimulations,
        setVariation,
      }}
    >
      {children}
    </UserInputContext.Provider>
  );
};

// 10/9 6:40am
// // src/context/UserInputContext.tsx
// import React, { createContext, useState, ReactNode } from "react";

// interface UserInputContextType {
//   lat: number | null;
//   lon: number | null;
//   setLocation: (input: string) => void; // takes "lat,lon" string
// }

// export const UserInputContext = createContext<UserInputContextType>({
//   lat: null,
//   lon: null,
//   setLocation: () => {},
// });

// export const UserInputProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [lat, setLat] = useState<number | null>(null);
//   const [lon, setLon] = useState<number | null>(null);

//   // Parses input string "lat,lon" and updates state
//   const setLocation = (input: string) => {
//     console.log("input:" + input);
//     const [latStr, lonStr] = input.split(",");
//     const parsedLat = parseFloat(latStr.trim());
//     const parsedLon = parseFloat(lonStr.trim());

//     if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
//       setLat(parsedLat);
//       setLon(parsedLon);
//     } else {
//       console.error("Invalid location input. Please use format: lat,lon");
//     }
//   };

//   return (
//     <UserInputContext.Provider value={{ lat, lon, setLocation }}>
//       {children}
//     </UserInputContext.Provider>
//   );
// };
