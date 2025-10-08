import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import locationRoutes from "./routes/location.js";
dotenv.config();
const app = express();
// Parse JSON body
app.use(express.json());
// Enable CORS for your frontend
app.use(cors({
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
}));
// Handle OPTIONS preflight requests for all routes
app.options("*", cors());
// Test route to verify backend is reachable from frontend
app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working!" });
});
// Location API routes
app.use("/api/location", locationRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
