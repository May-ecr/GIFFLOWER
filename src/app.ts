import express from "express";
import cors from "cors";
import cotizacionRoutes from "./routes/cotizacionRoutes";
import historialRoutes from "./routes/historialRoutes";
import excelRoutes from "./routes/excelRoute";

const app = express();

// 1. Habilitar CORS para permitir peticiones desde Live Server / Frontend
app.use(cors());

// 2. Parsear el cuerpo de las peticiones a JSON
app.use(express.json());

// 3. Rutas de la API
app.use("/cotizacion", cotizacionRoutes);
app.use("/historial", historialRoutes);
app.use("/cotizacion/excel", excelRoutes);

export default app;