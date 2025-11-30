import mongoose from "mongoose";
export async function connectToDB() {
    try {
        const MONGO_URL = process.env.MONGO_URL;
        if (!MONGO_URL)
            throw new Error(`Database Url is missing in the .env file 💥💥💥💥`);
        await mongoose.connect(MONGO_URL);
        console.log(`Sucessfully Connected to Mongodb ✅`);
    }
    catch (error) {
        console.log(`Failed to connect to mongo DB 💥💥💥`, error.message);
    }
}
//# sourceMappingURL=database.js.map