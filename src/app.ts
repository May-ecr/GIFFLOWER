import express from "express";
import cotizacionRoutes from "./routes/cotizacionRoutes";

const app = express();

app.use(express.json());

app.use("/cotizacion", cotizacionRoutes);

export default app;