import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🚀 API Gateway is running on ${HOST}:${PORT}`);
  console.log(`📡 Services configured:`);
  console.log(`   - Auth Service: ${process.env.AUTH_SERVICE_URL || "http://auth-service:8080"}`);
  console.log(`   - Mentor Service: ${process.env.MENTOR_SERVICE_URL || "http://mentor-service:8080"}`);
  console.log(`   - Client URL: ${process.env.CLIENT_URL || "Not configured"}`);
});

