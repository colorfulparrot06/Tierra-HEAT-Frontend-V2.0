import express from "express";
import { getLocationAnalysis } from "../controllers/locationController.js";
const router = express.Router();
// POST /api/location/analyze
router.post("/analyze", getLocationAnalysis);
export default router;
