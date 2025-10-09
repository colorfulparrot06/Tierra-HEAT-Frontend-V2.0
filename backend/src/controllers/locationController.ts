import { Request, Response } from "express";
import { getGeothermalViaBCL } from "../services/geothermalService.js";
import { getSolarData } from "../services/solarService.js";
import { recommendSystems } from "../services/recommendationService.js";
import { runReopt } from "../services/reoptService.js";
import { runCandidateGrid, runMonteCarlo as monteCarloService } from "../services/financialService.js";

export const getLocationAnalysis = async (req: Request, res: Response) => {
  try {
    const { lat, lon, loads_kw, doe_reference_name, annual_kwh, urdb_label } = req.body;

    if (lat == null || lon == null) {
      return res.status(400).json({ error: "Latitude and longitude required" });
    }

    // --- Fetch renewable energy data ---
    const geothermal = await getGeothermalViaBCL(lat, lon);
    const solar = await getSolarData(lat, lon);
    const recommendations = recommendSystems(geothermal, solar);

    // --- Run REopt analysis ---
    let reoptResult: any;
    try {
      reoptResult = await runReopt(lat, lon, {
        loads_kw,
        doe_reference_name,
        annual_kwh,
        urdb_label,
        analysis_years: 20,
      });
    } catch (err: unknown) {
      console.error("REopt run failed:", err);
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? (err as any).message
          : String(err);
      reoptResult = { error: "REopt run failed", details: errorMessage };
    }

    // --- Respond with location + REopt data ---
    res.json({ geothermal, solar, recommendations, reopt: reoptResult });
  } catch (err: unknown) {
    console.error("Location analysis failed:", err);
    const errorMessage =
      err && typeof err === "object" && "message" in err
        ? (err as any).message
        : String(err);
    res.status(500).json({ error: "Failed to retrieve location data", details: errorMessage });
  }
};


export const getCandidates = async (req: Request, res: Response) => {
  try {
    const { reoptResult, budget_range } = req.body;

    if (!reoptResult) {
      return res.status(400).json({ error: "REopt result required to generate candidates" });
    }

    const candidates = await runCandidateGrid(reoptResult, budget_range);
    res.json({ count: candidates.length, candidates });
  } catch (err: unknown) {
    console.error("Candidate grid failed:", err);
    const errorMessage =
      err && typeof err === "object" && "message" in err
        ? (err as any).message
        : String(err);
    res.status(500).json({ error: "Candidate grid failed", details: errorMessage });
  }
};



export const runMonteCarlo = async (req: Request, res: Response) => {
  try {
    const { candidates } = req.body;

    if (!candidates || !Array.isArray(candidates)) {
      return res.status(400).json({ error: "Candidate systems required for Monte Carlo" });
    }

    const mcResults = await monteCarloService(candidates);
    res.json(mcResults);
  } catch (err: unknown) {
    console.error("Monte Carlo failed:", err);
    const errorMessage =
      err && typeof err === "object" && "message" in err
        ? (err as any).message
        : String(err);
    res.status(500).json({ error: "Monte Carlo failed", details: errorMessage });
  }
};
