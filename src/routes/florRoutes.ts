import { Router } from "express";

import {
    listarFlores,
    listarCatalogoFlores,
    registrarFlor,
    cambiarPrecioFlor,
    cambiarEstadoFlor
} from "../controllers/florController";

const router = Router();


// Flores activas para cotización
router.get(
    "/",
    listarFlores
);


// Catálogo completo
router.get(
    "/catalogo",
    listarCatalogoFlores
);


// Registrar flor
router.post(
    "/",
    registrarFlor
);


// Editar precios
router.put(
    "/:id",
    cambiarPrecioFlor
);
router.patch(
    "/:id/estado",
    cambiarEstadoFlor
);

export default router;