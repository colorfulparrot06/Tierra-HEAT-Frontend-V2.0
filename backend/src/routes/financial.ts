// backend/src/routes/financial.ts
import express from "express";
import { runCandidateGrid, runMonteCarlo } from "../services/financialService.js";
import { runReopt } from "../services/reoptService.js";

const router = express.Router();

/**
 * POST /api/financial/analyze
 * Example body:
 * {
 *   "lat": 39.74,
 *   "lon": -104.99,
 *   "budgetRange": { "min": 5000, "max": 50000 }
 * }
 */
router.post("/analyze", async (req, res) => {
  try {
    const { lat, lon, budgetRange } = req.body;

    if (!lat || !lon || !budgetRange) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Step 1: Run REopt simulation
    const reoptResult = await runReopt(lat, lon, {
      doe_reference_name: "Hospital",
      annual_kwh: 1_000_000,
    });

    // Step 2: Generate candidate systems
    const candidates = await runCandidateGrid(reoptResult, budgetRange);

    // Step 3: Run Monte Carlo simulation
    const monteCarloResults = await runMonteCarlo(candidates);

    res.json({ candidates, monteCarloResults });
  } catch (err: any) {
    console.error("Financial analysis error:", err);
    res.status(500).json({ error: "Financial analysis failed", details: err.message });
  }
});

export default router;
