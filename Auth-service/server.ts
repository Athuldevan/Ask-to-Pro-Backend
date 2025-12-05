import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();
console.log("REDIS_URL =>", process.env.REDIS_URL);


import {  connectRedis  } from "./config/redis.js";
await connectRedis();
console.log(`Redis connected sucessfully✅`);


import { connectToDB } from "./config/database.js";
connectToDB();


app.listen(4000, () => {
  console.log(`Auth service is running on the port 4000⌛`);
});
