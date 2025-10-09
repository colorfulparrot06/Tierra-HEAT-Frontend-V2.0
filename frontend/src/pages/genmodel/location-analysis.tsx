// src/pages/genmodel/location-analysis.tsx
import React, { useContext, useEffect, useState } from "react";
import { UserInputContext } from "../../context/UserInputContext";
import InfoCard from "../../components/InfoCard";
import "../../styles/Output/location-analysis.css";

type Geothermal = {
  temperatureGradient?: number;
  resourceDepth?: number;
  capacityFactor?: number;
  heatFlow?: number;
  componentsNearby?: any[]; // optional, keep flexible
  count?: number;
};

type Solar = {
  acAnnual?: number;
  solradAnnual?: number;
  capacityFactor?: number;
  resource?: {
    avgGhiAnnual?: number;
    avgDniAnnual?: number;
    avgLatTiltAnnual?: number;
  } | null;
};

type RecommendationsType = {
  recommendations?: string[];
  geothermalType?: string;
  solarType?: string;
};

type ApiResponse = {
  location?: { lat: number; lon: number };
  geothermal?: Geothermal;
  solar?: Solar;
  recommendations?: RecommendationsType;
};

const BACKEND_BASE = "http://localhost:3000"; // update if your backend runs on a different port

// Small heuristic to produce a UX score from solar+geothermal numbers
function computeScore(geothermal?: Geothermal, solar?: Solar) {
  let score = 0;
  if (solar?.solradAnnual) {
    // solradAnnual usually kWh/m2/day-ish; normalize roughly
    score += Math.min(30, (solar.solradAnnual / 6) * 30); // scale to ~0-30
  } else if (solar?.acAnnual) {
    score += Math.min(30, (solar.acAnnual / 8000) * 30);
  }

  if (geothermal?.temperatureGradient) {
    score += Math.min(40, (geothermal.temperatureGradient / 80) * 40); // 0-40 range
  }

  // small bonus for capacity factors
  if (solar?.capacityFactor)
    score += Math.min(15, (solar.capacityFactor / 20) * 15);
  if (geothermal?.capacityFactor)
    score += Math.min(15, (geothermal.capacityFactor / 1) * 5);

  score = Math.round(score);
  let grade = "Low";
  if (score >= 70) grade = "High";
  else if (score >= 40) grade = "Medium";

  return { score, grade };
}

const LocationAnalysis: React.FC = () => {
  const { lat, lon } = useContext(UserInputContext);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only hit API when lat & lon present
    if (lat == null || lon == null) return;

    const abortController = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const res = await fetch(`${BACKEND_BASE}/api/location/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat, lon }),
          signal: abortController.signal,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Server returned ${res.status} ${text}`);
        }

        const json: ApiResponse = await res.json();
        setData(json);
      } catch (err: any) {
        if (err.name === "AbortError") {
          // fetch was cancelled
          return;
        }
        console.error("LocationAnalysis fetch error:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [lat, lon]);

  // Loading / error / empty states
  if (!lat || !lon) {
    return (
      <p className="la-info">
        Enter coordinates (lat,lon) and press Generate Model to see analysis.
      </p>
    );
  }

  if (loading) {
    return <p className="la-info">Loading location analysis...</p>;
  }

  if (error) {
    return (
      <p className="la-error">Error fetching location analysis: {error}</p>
    );
  }

  if (!data) {
    return (
      <p className="la-info">No data available for these coordinates yet.</p>
    );
  }

  // compute a simple score/grade for the summary
  const { score, grade } = computeScore(data.geothermal, data.solar);

  return (
    <div className="location-analysis-section">
      <div className="la-header">
        <h2>Location Analysis</h2>
        <div className="la-summary">
          <div className="la-score">
            <div className="la-score-value">{score}</div>
            <div className="la-score-label">Overall Potential</div>
          </div>
          <div className={`la-grade la-grade-${grade.toLowerCase()}`}>
            {grade}
          </div>
        </div>
      </div>

      <div className="la-grid">
        <InfoCard
          title="Geothermal"
          subtitle={`Depth: ${data.geothermal?.resourceDepth ?? "N/A"} m`}
          accent="#7B3FE4"
        >
          <div className="metric-row">
            <div className="metric">
              <div className="metric-label">Temp Gradient</div>
              <div className="metric-value">
                {data.geothermal?.temperatureGradient ?? "N/A"} °C/km
              </div>
            </div>
            <div className="metric">
              <div className="metric-label">Heat Flow</div>
              <div className="metric-value">
                {data.geothermal?.heatFlow ?? "N/A"} mW/m²
              </div>
            </div>
            <div className="metric">
              <div className="metric-label">Nearby Components</div>
              <div className="metric-value">
                {data.geothermal?.count ??
                  data.geothermal?.componentsNearby?.length ??
                  0}
              </div>
            </div>
          </div>

          {data.geothermal?.componentsNearby &&
            data.geothermal.componentsNearby.length > 0 && (
              <div className="list-sample">
                <strong>Examples:</strong>
                <ul>
                  {data
                    .geothermal!.componentsNearby!.slice(0, 4)
                    .map((c: any) => (
                      <li key={c.uuid ?? c.id ?? c.name}>{c.name}</li>
                    ))}
                </ul>
              </div>
            )}
        </InfoCard>

        <InfoCard
          title="Solar Resource"
          subtitle={`AC Annual: ${data.solar?.acAnnual ?? "N/A"} kWh`}
          accent="#FF9F1C"
        >
          <div className="metric-row">
            <div className="metric">
              <div className="metric-label">GHI (avg)</div>
              <div className="metric-value">
                {(
                  data.solar?.resource?.avgGhiAnnual ??
                  data.solar?.solradAnnual ??
                  0
                ).toFixed(2)}{" "}
                kWh/m²/day
              </div>
            </div>
            <div className="metric">
              <div className="metric-label">DNI (avg)</div>
              <div className="metric-value">
                {(data.solar?.resource?.avgDniAnnual ?? 0).toFixed(2)}{" "}
                kWh/m²/day
              </div>
            </div>
            <div className="metric">
              <div className="metric-label">Capacity Factor</div>
              <div className="metric-value">
                {data.solar?.capacityFactor ?? "N/A"}
              </div>
            </div>
          </div>
        </InfoCard>

        <InfoCard
          title="Recommendations"
          subtitle="Suggested systems"
          accent="#2F855A"
        >
          <div className="recommend-list">
            <p>
              <strong>Geothermal:</strong>{" "}
              {data.recommendations?.geothermalType ?? "N/A"}
            </p>
            <p>
              <strong>Solar:</strong> {data.recommendations?.solarType ?? "N/A"}
            </p>

            {data.recommendations?.recommendations && (
              <ul>
                {data.recommendations.recommendations.map(
                  (rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  )
                )}
              </ul>
            )}
          </div>
        </InfoCard>
      </div>
    </div>
  );
};

export default LocationAnalysis;
