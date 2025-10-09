import React, { useContext, useEffect, useState } from "react";
import { UserInputContext } from "../../context/UserInputContext";
import "../../styles/Output/financial-analysis.css";

const FinancialAnalysis: React.FC = () => {
  const { budgetMin, budgetMax, simulations, variation } =
    useContext(UserInputContext);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Automatically run analysis when inputs are available
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ensure necessary inputs exist before calling backend
        if (budgetMin === null || budgetMax === null) {
          setError("Missing budget input.");
          setLoading(false);
          return;
        }

        // Call your backend endpoint (make sure it matches your backend route)
        const response = await fetch("http://localhost:3000/api/financial", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            budgetRange: { min: budgetMin, max: budgetMax },
            simulations,
            variation,
          }),
        });

        if (!response.ok) {
          throw new Error(`Backend error: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err: any) {
        console.error("Failed to fetch financial data:", err);
        setError("Failed to fetch financial data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [budgetMin, budgetMax, simulations, variation]);

  // Render logic
  return (
    <div className="financial-analysis">
      <h2>Financial Analysis Results</h2>

      {loading ? (
        <p>Loading financial data...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : data ? (
        <div className="financial-card">
          <p>
            <strong>Budget Range:</strong>{" "}
            {`$${budgetMin?.toLocaleString()} - $${budgetMax?.toLocaleString()}`}
          </p>
          <p>
            <strong>Simulations:</strong> {simulations}
          </p>
          <p>
            <strong>Variation:</strong> ±{(variation * 100).toFixed(0)}%
          </p>

          {/* Example output fields from backend */}
          <p>
            <strong>Expected ROI:</strong> {data.expectedROI || "N/A"}
          </p>
          <p>
            <strong>Payback Period:</strong> {data.paybackPeriod || "N/A"}
          </p>
          <p>
            <strong>Recommended System:</strong> {data.recommendation || "N/A"}
          </p>
        </div>
      ) : (
        <p>No data available yet.</p>
      )}
    </div>
  );
};

export default FinancialAnalysis;
