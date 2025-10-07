import apiClient from "../utils/apiClient.js";

export const getSolarData = async (lat: any, lon: any) => {
  const url = "https://developer.nrel.gov/api/pvwatts/v8.json";
  const params = {
    api_key: process.env.NREL_API_KEY,
    lat,
    lon,
    system_capacity: 5, // kW system
    module_type: 1, // Standard
    array_type: 1, // Fixed tilt
    tilt: 20,
    azimuth: 180,
  };

  const { data } = await apiClient.get(url, { params });

  const outputs = data.outputs || {};
  return {
    acAnnual: outputs.ac_annual,
    solradAnnual: outputs.solrad_annual,
    capacityFactor: outputs.capacity_factor,
  };
};
