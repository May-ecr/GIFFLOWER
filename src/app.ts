import express from "express";
import cotizacionRoutes from "./routes/cotizacionRoutes";
import historialRoutes from "./routes/historialRoutes";
import excelRoutes from "./routes/excelRoute";

const app = express();

app.use(express.json());

app.use("/cotizacion", cotizacionRoutes);
app.use("/historial", historialRoutes)
app.use("/cotizacion/excel", excelRoutes);

export default app;