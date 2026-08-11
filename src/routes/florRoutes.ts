import { Router } from "express";

import {
    listarFlores,
    registrarFlor,
    cambiarPrecioFlor
} from "../controllers/florController";

const router = Router();

router.get("/", listarFlores);

router.post("/", registrarFlor);

router.put("/:id", cambiarPrecioFlor);

export default router;