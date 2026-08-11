import { Request, Response } from "express";
import {
    obtenerFlores,
    crearFlor,
    actualizarPrecioFlor
} from "../services/florService";

//solicita todas las flores disponibles o existentes 
export const listarFlores = async (
    req: Request,
    res: Response
) => {
    try {
        const flores = await obtenerFlores();

        res.status(200).json(flores);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener las flores"
        });
    }
};

//crear nuevas flores
export const registrarFlor = async (
    req: Request,
    res: Response
) => {
    try {
        const { nombre, costoUnitario } = req.body;

        const nuevaFlor = await crearFlor(
            nombre,
            costoUnitario
        );

        res.status(201).json(nuevaFlor);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al registrar la flor"
        });
    }
};

export const cambiarPrecioFlor = async (
    req: Request,
    res: Response
) => {
    try {
        const  id  = req.params.id as string;
        const { costoUnitario } = req.body;

        const florActualizada =
            await actualizarPrecioFlor(
                id,
                costoUnitario
            );

        if (!florActualizada) {
            return res.status(404).json({
                mensaje: "Flor no encontrada"
            });
        }

        res.status(200).json(florActualizada);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al actualizar el precio"
        });
    }
};