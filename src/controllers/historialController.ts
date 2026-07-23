import { Request, Response } from "express";

import {obtenerHistorial, obtenerHistorialPorId, eliminarHistorial} from "../services/historialService";

export async function listarHistorial(req: Request, res: Response): Promise<void> {
    try {
        const historial = await obtenerHistorial();
        res.status(200).json(historial);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener el historial."
        });
    }
}

export async function buscarHistorialPorId(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            res.status(400).json({
                mensaje: "Id inválido."
            });
            return;
        }
        const historial = await obtenerHistorialPorId(id);
        if (!historial) {
            res.status(404).json({
                mensaje: "Cotización no encontrada."
            });
            return;
        }
        res.status(200).json(historial);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al buscar la cotización."
        });
    }
}
export async function borrarHistorial( req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            res.status(400).json({
                mensaje: "Id inválido."
            });
            return;
        }
        const historial = await eliminarHistorial(id);
        if (!historial) {
            res.status(404).json({
                mensaje: "Cotización no encontrada."
            });
            return;
        }

        res.status(200).json({
            mensaje: "Cotización eliminada correctamente."
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar la cotización."
        });
    }
}