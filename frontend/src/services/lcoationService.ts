// src/services/locationService.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // backend address

export async function getLocationPotential(lat: number, lon: number) {
  try {
    const response = await axios.post(`${API_BASE_URL}/location`, { lat, lon });
    return response.data; // this will include whatever the backend returns
  } catch (error) {
    console.error("Error fetching location potential:", error);
    throw error;
  }
}
