import apiClient from "../utils/apiClient.js";

export const getGeothermalViaBCL = async (lat: number, lon: number) => {
  // Build a BCL search URL that uses geospatial search
  const keyword = `location:${lat},${lon}`;
  const format = "json";
  const baseUrl = `https://bcl.nrel.gov/api/search/${encodeURIComponent(keyword)}.${format}`;
  
  const params = {
    show_rows: 10,
  };

  console.log("Fetching Geothermal data for: " + baseUrl);
  const { data } = await apiClient.get(baseUrl, { params });
  const results = data.result || [];
  console.log("Fetched Geothermal data:" + JSON.stringify(results, null, 3));

  // Simplify output
  const simplified = results.map((item: any) => ({
    uuid: item.component.uuid,
    name: item.component.name,
    bundle: item.component.bundle,
    tags: item.component.tags,
    attributes: item.component.attributes,
    url: item.component.url,
  }));

  return {
    queryLocation: { lat, lon },
    count: simplified.length,
    componentsNearby: simplified,
  };
};
