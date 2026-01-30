import express, { NextFunction, Request, Response } from "express";
import mentorRouter from "./routes/mentorRouter";
import adminRouter from "./routes/adminRouter";

import dotenv from "dotenv";

dotenv.config()

const app = express();


app.use(express.json());
app.use("/api/v1/mentor", mentorRouter);
app.use("/api/v1/admin", adminRouter);


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
