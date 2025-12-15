import express from "express";
import cookiParser from "cookie-parser";
import type { Request, Response, NextFunction } from "express";
import authRouter from "./routes/authRouter.js";
import cors from "cors";
const app = express();
const clinetUrl = process.env.CLIENT_URL;
if (!clinetUrl) console.log(`Client url is missing in the env file `);
app.use(
  cors({
    origin: clinetUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookiParser());

app.use("/api/v1/auth", authRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500 || 404;
  err.status = err.status || "error";
  err.data = err.data || null;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
});

export default app;
