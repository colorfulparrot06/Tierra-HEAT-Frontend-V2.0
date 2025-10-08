import axios from "axios";

const API_URL = "http://localhost:3000/";

export async function analyzeLocation(lat: number, lon: number) {
  console.log(lat, lon)
  try {
    const response = await axios.post(API_URL, { lat, lon });
    console.log("sending response")
    return response.data;
  } catch (error) {
    console.error("Error calling backend:", error);
    throw error;
  }
}
