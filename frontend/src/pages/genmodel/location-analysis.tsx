import React, { useContext, useEffect, useState } from "react";
import { UserInputContext } from "../../context/UserInputContext";
import "../../styles/Output/location-analysis.css";

const LocationAnalysis: React.FC = () => {
  const { lat, lon } = useContext(UserInputContext);
  const [data, setData] = useState<any>(null);

  const BACKEND_URL = "http://localhost:3000";

  useEffect(() => {
    if (lat != null && lon != null) {
      console.log("Calling API Server:" + lat + " " + lon);
      fetch(`${BACKEND_URL}/api/location/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json(); // <-- this line parses the JSON response
        })
        .then((data) => {
          console.log("Response from API Server:", data); // <-- here you can inspect the response
          setData(data); // store it in state
        })
        // .then((res) => {
        //   setData(res);
        // })
        .catch((err) => console.error("Failed to fetch backend data:", err));
      // }
    }
  }, [lat, lon]);

  if (!data)
    return (
      <p>
        Loading detailed analysis {lat} {lon}
      </p>
    );

  return (
    <div className="location-analysis-section">
      <h2>Location Analysis</h2>
      <div className="location-analysis-content">
        <h3>Geothermal Components Nearby:</h3>
        <p>{`Found ${data.geothermal.count} components. Examples:`}</p>
        <ul>
          {data.geothermal.componentsNearby.slice(0, 5).map((c: any) => (
            <li key={c.uuid}>{c.name}</li>
          ))}
        </ul>

        <h3>Solar Resource:</h3>
        <p>{`GHI: ${data.solar.resource.avgGhiAnnual.toFixed(
          2
        )} kWh/m²/day`}</p>
        <p>{`DNI: ${data.solar.resource.avgDniAnnual.toFixed(
          2
        )} kWh/m²/day`}</p>
        <p>{`Tilt: ${data.solar.resource.avgLatTiltAnnual.toFixed(2)}°`}</p>

        <h3>Recommendations:</h3>
        <ul>
          {data.recommendations.recommendations.map(
            (rec: string, idx: number) => (
              <li key={idx}>{rec}</li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default LocationAnalysis;
