export const recommendSystems = (geothermal: { temperatureGradient: any; resourceDepth?: any; capacityFactor?: any; heatFlow?: any; }, solar: { acAnnual?: any; solradAnnual?: any; capacityFactor: any; }) => {
    let geothermalType;
    if (geothermal.temperatureGradient > 70) {
      geothermalType = "Deep Enhanced Geothermal System (EGS)";
    } else if (geothermal.temperatureGradient > 50) {
      geothermalType = "Medium-depth Hydrothermal System";
    } else {
      geothermalType = "Ground Source Heat Pump (GSHP)";
    }
  
    let solarType;
    if (solar.capacityFactor > 18) {
      solarType = "Tracking PV Array";
    } else if (solar.capacityFactor > 15) {
      solarType = "Fixed Tilt Rooftop PV";
    } else {
      solarType = "Community Solar Installation";
    }
  
    return { geothermalType, solarType };
  };
  