import app from "./app.js";
import dotenv from "dotenv";
import { connectToDB } from "./config/database.js";
import { createClient } from "redis";
dotenv.config();
/**
 *
 * DB_PASSWORD=L7YKO7wLIe5PzWBv
DB_URL=mongodb+srv://athuldevan90_db_user:L7YKO7wLIe5PzWBv@ask-to-pro.97cgjey.mongodb.net/Auth?appName=Ask-to-pro
 */
const client = await createClient().on("error", (err) => console.log("Redis Client Error", err));
await client.connect();
console.log(`Redis connected sucessfully✅`);
connectToDB();
app.listen(5000, () => {
    console.log(`Auth service is running on the port 8000⌛`);
});
//# sourceMappingURL=server.js.map