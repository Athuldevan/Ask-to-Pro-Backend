"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDB = connectToDB;
const mongoose_1 = __importDefault(require("mongoose"));
const DB_URL = process.env.MONGO_URL;
async function connectToDB() {
    try {
        const MONGO_URL = process.env.MONGO_URL;
        if (!MONGO_URL)
            throw new Error(`Database Url is missing in the .env file 💥💥💥💥`);
        await mongoose_1.default.connect(MONGO_URL);
        console.log(`Sucessfully Connected to Mongodb ✅`);
    }
    catch (error) {
        console.log(`Failed to connect to mongo DB 💥💥💥`, error.message);
    }
}
