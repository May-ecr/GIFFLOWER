import { Router } from "express";
import { descargarExcel } from "../controllers/excelController";

const router = Router();

router.post("/", descargarExcel);

export default router;