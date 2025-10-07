import express from "express";
import dotenv from "dotenv";
import cors from "cors"; /*adding cors 10:32pm */
import locationRoutes from "./routes/location.js";
dotenv.config();
const app = express();
app.use(cors()); /*adding cors 10:32pm */
app.use(express.json());
app.use("/api/location", locationRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
