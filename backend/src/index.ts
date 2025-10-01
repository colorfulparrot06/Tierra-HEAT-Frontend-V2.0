import express from "express";
import cors from "cors";
import locationRoutes from "./routes/location"; // path must be correct
import dotenv from "dotenv";
dotenv.config(); // loads API key from .env

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


app.use("/api/location", locationRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
