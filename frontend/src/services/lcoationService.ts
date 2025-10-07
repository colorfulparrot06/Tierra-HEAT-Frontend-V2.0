import axios from "axios";

const API_URL = "http://localhost:5000/api/location/analyze";

export async function analyzeLocation(lat: number, lon: number) {
  try {
    const response = await axios.post(API_URL, { lat, lon });
    return response.data;
  } catch (error) {
    console.error("Error calling backend:", error);
    throw error;
  }
}
