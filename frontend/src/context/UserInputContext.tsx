// src/context/UserInputContext.tsx
import React, { createContext, useState, ReactNode } from "react";

interface UserInputContextType {
  lat: number | null;
  lon: number | null;
  setLocation: (input: string) => void; // takes "lat,lon" string
}

export const UserInputContext = createContext<UserInputContextType>({
  lat: null,
  lon: null,
  setLocation: () => {},
});

export const UserInputProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);

  // Parses input string "lat,lon" and updates state
  const setLocation = (input: string) => {
    console.log("input:" + input);
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

  return (
    <UserInputContext.Provider value={{ lat, lon, setLocation }}>
      {children}
    </UserInputContext.Provider>
  );
};
