import { Router } from "express";

import {
    listarHistorial,
    buscarHistorialPorId,
    borrarHistorial
} from "../controllers/historialController";

const router = Router();
router.get("/", listarHistorial);
router.get("/:id", buscarHistorialPorId);
router.delete("/:id", borrarHistorial);

export default router;