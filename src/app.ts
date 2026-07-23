import express from "express";
import cotizacionRoutes from "./routes/cotizacionRoutes";
import historialRoutes from "./routes/historialRoutes";

const app = express();

app.use(express.json());

app.use("/cotizacion", cotizacionRoutes);
app.use("/historial", historialRoutes)

export default app;