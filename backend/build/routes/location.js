// src/routes/location.ts
import express from "express";
import { getLocationAnalysis, getCandidates, runMonteCarlo } from "../controllers/locationController.js";
const router = express.Router();
// POST /api/location/analyze -> single REopt run
router.post("/analyze", getLocationAnalysis);
// POST /api/location/candidates -> run candidate grid and return ranked results
router.post("/candidates", getCandidates);
// POST /api/location/montecarlo -> run Monte Carlo
router.post("/montecarlo", runMonteCarlo);
export default router;
