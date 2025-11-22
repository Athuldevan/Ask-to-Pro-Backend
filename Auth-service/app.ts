import express from "express";
import type { Request, Response, NextFunction } from "express";
import authRouter from "./routes/authRouter.js";
const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.data = err.data || null;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
 
  });
});

export default app;
