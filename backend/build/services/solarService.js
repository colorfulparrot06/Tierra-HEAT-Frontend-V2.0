// src/services/solarService.ts
import apiClient from "../utils/apiClient.js";
export const getSolarData = async (lat, lon) => {
    const apiKey = process.env.NREL_API_KEY;
    if (!apiKey)
        throw new Error("Missing NREL_API_KEY");
    try {
        // 1️⃣ Solar Resource
        console.log("Fetching Solar Resource data...");
        const resourceUrl = "https://developer.nrel.gov/api/solar/solar_resource/v1.json";
        const resourceParams = { api_key: apiKey, lat, lon };
        console.log("Fetching Solar Resource...");
        const resourceResp = await apiClient.get(resourceUrl, { params: resourceParams });
        console.log("Solar Resource OK");
        const outputs = resourceResp.data?.outputs || {};
        const solarResource = {
            avgDniAnnual: outputs.avg_dni?.annual ?? null,
            avgGhiAnnual: outputs.avg_ghi?.annual ?? null,
            avgLatTiltAnnual: outputs.avg_lat_tilt?.annual ?? null,
        };
        // 2️⃣ PVWatts
        console.log("Fetching PVWatts data...");
        const pvUrl = "https://developer.nrel.gov/api/pvwatts/v8.json";
        const pvParams = {
            api_key: apiKey,
            lat,
            lon,
            system_capacity: 5,
            module_type: 1,
            array_type: 1,
            tilt: lat,
            losses: 5,
            azimuth: 180,
        };
        console.log("Fetching PVWatts...");
        const pvResp = await apiClient.get(pvUrl, { params: pvParams });
        console.log("PVWatts OK");
        const pvOutputs = pvResp.data?.outputs || {};
        const performance = {
            acAnnual: pvOutputs.ac_annual ?? null,
            solradAnnual: pvOutputs.solrad_annual ?? null,
            capacityFactor: pvOutputs.capacity_factor ?? null,
        };
        return { resource: solarResource, performance };
    }
    catch (err) {
        console.error("Error fetching solar data:", err.response?.data || err.message);
        throw new Error("Failed to fetch solar data from NREL API");
    }
};
