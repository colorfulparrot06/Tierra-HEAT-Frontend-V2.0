import React, { useContext, useEffect, useState } from "react";
import { UserInputContext } from "../../context/UserInputContext";
import "../../styles/Output/Overview.css";

interface OverviewData {
  geothermalSummary: string;
  solarSummary: string;
  recommendationsSummary: string;
}

const Overview: React.FC = () => {
  const { lat, lon } = useContext(UserInputContext);
  const [data, setData] = useState<OverviewData | null>(null);

  const BACKEND_URL = "http://localhost:5000";


  useEffect(() => {
    if (lat && lon) {
      const BACKEND_URL = "http://localhost:5000";
      fetch(`${BACKEND_URL}/api/location/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then((res) => {
          setData({
            geothermalSummary: `Found ${res.geothermal.count} nearby geothermal components.`,
            solarSummary: `Average solar GHI: ${res.solar.resource.avgGhiAnnual.toFixed(2)} kWh/m²/day.`,
            recommendationsSummary: res.recommendations.summary,
          });
        })
        .catch((err) => console.error("Failed to fetch backend data:", err));
    }
  }, [lat, lon]);
  
  if (!data) return <p>Loading Overview...</p>;

  return (
    <div className="overview-section">
      <h2>Overview</h2>
      <div className="overview-content">
        <p>{data.geothermalSummary}</p>
        <p>{data.solarSummary}</p>
        <p>{data.recommendationsSummary}</p>
      </div>
    </div>
  );
};

export default Overview;
