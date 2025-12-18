import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

import { connectRedis } from "./config/redis.js";
import { connectToDB } from "./config/database.js";
connectToDB();

const PORT = Number(process.env.PORT) || 8080;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Auth service running on ${HOST}:${PORT}`);
});

// connect infra AFTER server is up
connectRedis()
  .then(() => console.log("Redis connected"))
  .catch((err) => console.error("Redis error", err));

connectToDB()
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB error", err));
