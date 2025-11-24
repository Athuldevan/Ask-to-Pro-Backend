import { createClient } from "redis";
export const client = createClient({
    url: process.env.REDIS_URL,
});
client.on("error", (err) => {
    console.error("Redis Client Error:", err);
});
export async function connectRedis() {
    await client.connect();
    console.log("Redis connected successfully");
}
//# sourceMappingURL=redis.js.map