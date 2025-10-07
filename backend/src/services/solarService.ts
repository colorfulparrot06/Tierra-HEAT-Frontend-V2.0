import apiClient from "../utils/apiClient.js";

export const getSolarData = async (lat: number, lon: number) => {
  // Fetch the resource / insolation data
  const resourceUrl = "https://developer.nrel.gov/api/solar/solar_resource/v1.json";
  const resourceParams = {
    api_key: process.env.NREL_API_KEY,
    lat,
    lon,
  };

  const resourceResp = await apiClient.get(resourceUrl, { params: resourceParams });
  const resourceData = resourceResp.data;

  const outputs = resourceData.outputs || {};

  const solarResource = {
    avgDniAnnual: outputs.avg_dni,
    avgGhiAnnual: outputs.avg_ghi,
    avgLatTiltAnnual: outputs.avg_lat_tilt,
  };

  // Fetch performance estimates via PVWatts
  const pvUrl = "https://developer.nrel.gov/api/pvwatts/v8.json";
  const pvParams = {
    api_key: process.env.NREL_API_KEY,
    lat,
    lon,
    system_capacity: 5, 
    module_type: 1,   
    array_type: 1,   
    tilt: lat,        
    azimuth: 180,      
  };

  const pvResp = await apiClient.get(pvUrl, { params: pvParams });
  const pvData = pvResp.data;
  const pvOutputs = pvData.outputs || {};

  const performance = {
    acAnnual: pvOutputs.ac_annual,
    solradAnnual: pvOutputs.solrad_annual,
    capacityFactor: pvOutputs.capacity_factor,
  };

  return {
    resource: solarResource,
    performance,
  };
};
