import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns"

dotenv.config();

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

export const conectarBase = async (): Promise<void> => {
    try{
        //console.log("URI:", process.env.MONGO_URI);
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gifflower";
        //await mongoose.connect(process.env.MONGO_URI as string);
        await mongoose.connect(mongoUri);
        console.log("MongoDB conectado correctamente");
    }catch(error){
        console.error("error al conectar MongoDB");
        console.error(error);

        process.exit(1);
    }
}