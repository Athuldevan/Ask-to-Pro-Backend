import app from  "./app"
import dotenv from "dotenv";
import { connectToDB } from "./config/database";
dotenv.config();


const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
const HOST = process.env.HOST || "0.0.0.0";

connectToDB();

app.listen(PORT, HOST, () => {
    console.log(`Mentor service is running on ${HOST}:${PORT}`);
})