import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from './db/connect';
dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
app.use("/api", require("./routes/authRoutes"));




// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript + Express backend!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
