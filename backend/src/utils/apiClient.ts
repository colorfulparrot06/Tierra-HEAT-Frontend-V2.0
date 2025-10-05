import axios from "axios";

// Function to get solar data from NREL
export async function getSolarData(lat: number, lon: number): Promise<number> {
  const apiKey = process.env.NREL_API_KEY; // loads key from .env
  const url = `https://developer.nrel.gov/api/pvwatts/v6.json?api_key=${apiKey}&lat=${lat}&lon=${lon}`;

  try {
    const response = await axios.get(url);
    const solradMonthly = response.data.outputs?.solrad_monthly;

    if (!solradMonthly || !Array.isArray(solradMonthly)) return 4.5; // fallback

    // Compute average solar radiation
    const avgSolrad = solradMonthly.reduce((a: number, b: number) => a + b, 0) / solradMonthly.length;
    return avgSolrad;
  } catch (error) {
    console.error("Error fetching NREL data:", error);
    return 4.5; // fallback
  }
}
