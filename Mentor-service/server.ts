import app from  "./app"
import dotenv from "dotenv";
import { connectToDB } from "./config/database";
dotenv.config();


const PORT=process.env.PORT ? Number(process.env.PORT) : undefined;
if (!PORT) {
  console.error('Port is missing or invalid in the .env file');
  process.exit(1); 
}
connectToDB();

app.listen(PORT,"localhost" ,()=> {
    console.log(`Server is listening on the port ${PORT}`)

})