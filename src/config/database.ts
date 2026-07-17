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
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("MongoDB conectado correctamente");
    }catch(error){
        console.error("error al conectar MongoDB");
        console.error(error);

        process.exit(1);
    }
}