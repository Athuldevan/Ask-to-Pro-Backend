import { createClient } from "redis";
import  dotenv from 'dotenv';
dotenv.config()
console.log("REDIS_URL from process:", process.env.REDIS_URL);

export const client = createClient({
  url: process.env.REDIS_URL!,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
});

client.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

export async function connectRedis() {
  await client.connect();
  console.log("Redis connected successfully");
}
