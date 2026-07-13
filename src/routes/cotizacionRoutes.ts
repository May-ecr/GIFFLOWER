import { Router } from "express";
import { calcularCotizacion } from "../controllers/cotizacionController";

const router = Router();

router.post("/", calcularCotizacion);

export default router;