import apiClient from "../utils/apiClient";

export const getGeothermalData = async (lat: any, lon: any) => {
  const url = "https://developer.nrel.gov/api/georesources/v1/";
  const params = {
    api_key: process.env.NREL_API_KEY,
    lat,
    lon,
  };

  const { data } = await apiClient.get(url, { params });

  // Simplify output
  return {
    temperatureGradient: data.temperature_gradient || "N/A",
    resourceDepth: data.depth || "N/A",
    capacityFactor: data.capacity_factor || "N/A",
    heatFlow: data.heat_flow || "N/A",
  };
};
