// src/controllers/locationController.ts
import { Request, Response } from "express";
import { getGeothermalViaBCL } from "../services/geothermalService.js";
import { getSolarData } from "../services/solarService.js";
import { recommendSystems } from "../services/recommendationService.js";
import { request } from "http";

export const getLocationAnalysis = async (req: Request, res: Response) => {
  console.log(request);

  try {
    const { lat, lon } = req.body;

    if (lat == null || lon == null) {
      return res.status(400).json({ error: "Latitude and longitude required" });
    }

    const geothermal = await getGeothermalViaBCL(lat, lon);
    const solar = await getSolarData(lat, lon);
    const recommendations = recommendSystems(geothermal, solar);

    res.json({
      geothermal,
      solar,
      recommendations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve location data" });
  }
};
