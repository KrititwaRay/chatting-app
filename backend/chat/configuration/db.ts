import mongoose from "mongoose";

const connectDb = async () => {
    const url = process.env.DB_URL as string;
    if (!url) { 
        throw new Error(`❌ MONGO_URI is not defined in enviroment variables.`)
    }
    try {
        await mongoose.connect(url, {
            dbName: "chat_app_microservice"
        })
        console.log(`✅ Connected to mongodb!`)
    } catch (error) {
        console.error(`❌ Failed to connect to Mongodb. `, error);
        process.exit(1)
    }
}

export default connectDb;