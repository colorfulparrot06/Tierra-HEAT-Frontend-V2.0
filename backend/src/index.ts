import express from "express";
import dotenv from "dotenv";
import cors from "cors"; /*adding cors 10:32pm */
import locationRoutes from "./routes/location.js";
declare const process: any;

dotenv.config();
const app = express();
app.use(
        cors({
          origin: "http://localhost:5173", // frontend origin
          methods: ["GET", "POST", "OPTIONS"], // allowed methods
          allowedHeaders: ["Content-Type"], // headers allowed
        })
      );
      
app.use(express.json());
app.use("/api/location", locationRoutes);
app.get ('/', (req, res) => {
        res.send("Hello Client, use the right path for the services")
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// app.get('/api/location/analyze', (req, res) => {
//     console.log(req)
//     res.send('Hello Analyze!')
//   })