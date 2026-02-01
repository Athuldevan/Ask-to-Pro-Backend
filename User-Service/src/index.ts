import express from "express";
import mongoose from "mongoose";
import morganMiddleware from "./utils/morgan";
import cors from "cors";
import errorHandler from "./utils/errorHandler";

const DB_URL = process.env.MONGO_URL as string;

mongoose
  .connect(DB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Error Connecting to MongoDB", error.message));

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(morganMiddleware);
app.use(cors());

app.use(errorHandler);

export default app;
