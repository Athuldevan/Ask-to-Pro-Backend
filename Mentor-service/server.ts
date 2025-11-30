import app from  "./app";
import { connectToDB } from "./config/database";

connectToDB();

app.listen(6000,"localhost" ,()=> {
    console.log(`Server is listening on the port 6000`)

})