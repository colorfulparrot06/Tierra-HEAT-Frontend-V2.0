import { getGeothermalData } from "../services/geothermalService.js";
import { getSolarData } from "../services/solarService.js";
import { recommendSystems } from "../services/recommendationService.js";

export const getLocationAnalysis = async (req, res) => {
  try {
    const { lat, lon } = req.body;
    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude and longitude required" });
    }

    const geothermal = await getGeothermalData(lat, lon);
    const solar = await getSolarData(lat, lon);
    const recommendations = recommendSystems(geothermal, solar);

    const result = {
      location: { lat, lon },
      geothermal,
      solar,
      recommendations,
    };

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve location data" });
  }
};
