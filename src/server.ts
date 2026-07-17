import app from "./app";
import dotenv from "dotenv";
import { conectarBase } from "./config/database";
dotenv.config();

const PORT = process.env.PORT || 3000;
const iniciarServidor = async (): Promise<void> => {
    await conectarBase();
    app.listen(PORT, () => {
        console.log(`Servidor ejecutandose en el puerto ${PORT}`);
    });

};

iniciarServidor();