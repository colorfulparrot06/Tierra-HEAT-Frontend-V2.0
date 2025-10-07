export const recommendSystems = (geothermal, solar) => {
    const recommendations = [];
    const ghi = solar.resource?.avgGhiAnnual || solar.performance?.solradAnnual;
    if (ghi && ghi > 4.5) {
        recommendations.push("High solar irradiance detected — rooftop solar PV systems are strongly recommended.");
    }
    else if (ghi) {
        recommendations.push("Moderate solar resource — solar systems are viable with optimized tilt and tracking.");
    }
    else {
        recommendations.push("Solar data unavailable — recommend site survey.");
    }
    // Geothermal logic stays the same...
    if (geothermal.count > 0) {
        const hasWeatherFile = geothermal.componentsNearby.some((c) => c.tags?.includes("Weather File"));
        if (hasWeatherFile) {
            recommendations.push("Local weather and subsurface components found — consider ground-source heat pumps or hybrid systems.");
        }
        else {
            recommendations.push("No specific geothermal components found nearby — feasibility study suggested.");
        }
    }
    else {
        recommendations.push("No nearby geothermal resources found — rely primarily on solar systems.");
    }
    return {
        summary: "Location-based renewable energy recommendation",
        recommendations,
    };
};
