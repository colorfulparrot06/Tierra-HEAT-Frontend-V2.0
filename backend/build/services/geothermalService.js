import apiClient from "../utils/apiClient.js";
export const getGeothermalViaBCL = async (lat, lon) => {
    // Build a BCL search URL that uses geospatial search
    const keyword = `location:${lat},${lon}`;
    const format = "json";
    const baseUrl = `https://bcl.nrel.gov/api/search/${encodeURIComponent(keyword)}.${format}`;
    const params = {
        show_rows: 10,
    };
    const { data } = await apiClient.get(baseUrl, { params });
    const results = data.result || [];
    // Simplify output
    const simplified = results.map((item) => ({
        uuid: item.uuid,
        name: item.name,
        bundle: item.bundle,
        tags: item.tags,
        attributes: item.attributes,
        url: item.url,
    }));
    return {
        queryLocation: { lat, lon },
        count: simplified.length,
        componentsNearby: simplified,
    };
};
