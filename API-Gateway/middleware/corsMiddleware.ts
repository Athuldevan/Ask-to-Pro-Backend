import cors from "cors";
import type { Express } from "express";

export const configureCORS = (app: Express) => {
  const clientUrl = process.env.CLIENT_URL;
  
  if (!clientUrl) {
    console.warn("⚠️  CLIENT_URL is missing in the env file");
  }

  app.use(
    cors({
      origin: clientUrl || "*",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: ["Authorization"],
    })
  );
};

