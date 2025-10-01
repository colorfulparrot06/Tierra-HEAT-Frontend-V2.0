import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  const { latitude, longitude } = req.body;

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return res.status(400).json({ error: "latitude and longitude must be numbers" });
  }

  res.json({
    latitude,
    longitude,
    solarKwhPerM2: 5.0,
    heatingDegreeDays: 1200,
    score: 60,
    grade: "Medium",
    notes: "Dummy response"
  });
});

export default router; // ✅ must have default export
