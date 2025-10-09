// backend/src/routes/financial.ts
import express from "express";
import { runCandidateGrid, runMonteCarlo } from "../services/financialService.js";
import { runReopt } from "../services/reoptService.js";
const router = express.Router();
/**
 * POST /api/financial/analyze
 */
router.post("/analyze", async (req, res) => {
    try {
        const { lat, lon, budgetRange } = req.body;
        console.log("[financial/analyze] Request body:", req.body);
        if (!lat || !lon || !budgetRange) {
            console.warn("[financial/analyze] Missing required parameters");
            return res.status(400).json({ error: "Missing required parameters" });
        }
        // Step 1: Run REopt simulation
        console.log("[financial/analyze] Running REopt simulation...");
        const reoptResult = await runReopt(lat, lon, {
            doe_reference_name: "Hospital",
            annual_kwh: 1000000,
        });
        console.log("[financial/analyze] REopt result received:", reoptResult);
        // Step 2: Generate candidate systems
        console.log("[financial/analyze] Generating candidate systems...");
        const candidates = await runCandidateGrid(reoptResult, budgetRange);
        console.log("[financial/analyze] Candidate systems generated:", candidates);
        // Step 3: Run Monte Carlo simulation
        console.log("[financial/analyze] Running Monte Carlo simulation...");
        const monteCarloResults = await runMonteCarlo(candidates);
        console.log("[financial/analyze] Monte Carlo results:", monteCarloResults);
        res.json({ candidates, monteCarloResults });
    }
    catch (err) {
        console.error("[financial/analyze] Financial analysis error:", err);
        res.status(500).json({ error: "Financial analysis failed", details: err.message });
    }
});
export default router;
