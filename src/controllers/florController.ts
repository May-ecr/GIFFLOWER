import { Request, Response } from "express";


import {
    obtenerFlores,
    obtenerCatalogoFlores,
    crearFlor,
    actualizarPrecioFlor,
    actualizarEstadoFlor
} from "../services/florService";


// ======================================================
// LISTAR FLORES ACTIVAS
// Para el cotizador
// ======================================================

export const listarFlores = async (
    req: Request,
    res: Response
) => {

    try {

        const flores =
            await obtenerFlores();


        res.status(200).json(flores);

    } catch (error) {

        console.error(
            "Error al obtener flores:",
            error
        );


        res.status(500).json({
            mensaje:
                "Error al obtener las flores"
        });
    }
};


// ======================================================
// LISTAR CATÁLOGO COMPLETO
// ======================================================

export const listarCatalogoFlores = async (
    req: Request,
    res: Response
) => {

    try {

        const flores =
            await obtenerCatalogoFlores();


        res.status(200).json(flores);

    } catch (error) {

        console.error(
            "Error al obtener catálogo:",
            error
        );


        res.status(500).json({
            mensaje:
                "Error al obtener el catálogo de flores"
        });
    }
};


// ======================================================
// REGISTRAR NUEVA FLOR
// ======================================================

export const registrarFlor = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            nombre,
            precio,
            precioLista
        } = req.body;


        if (
            !nombre ||
            precio === undefined ||
            precioLista === undefined
        ) {

            return res.status(400).json({
                mensaje:
                    "Nombre, precio y precio de lista son obligatorios"
            });
        }


        const nuevaFlor =
            await crearFlor(
                nombre,
                Number(precio),
                Number(precioLista)
            );


        res.status(201).json(
            nuevaFlor
        );

    } catch (error) {

        console.error(
            "Error al registrar flor:",
            error
        );


        res.status(500).json({
            mensaje:
                "Error al registrar la flor"
        });
    }
};


// ======================================================
// CAMBIAR PRECIOS
// ======================================================

export const cambiarPrecioFlor = async (
    req: Request,
    res: Response
) => {

    try {

        const id =
            req.params.id as string;


        const {
            precio,
            precioLista
        } = req.body;


        if (
            precio === undefined ||
            precioLista === undefined
        ) {

            return res.status(400).json({
                mensaje:
                    "Debes proporcionar precio y precio de lista"
            });
        }


        const florActualizada =
            await actualizarPrecioFlor(
                id,
                Number(precio),
                Number(precioLista)
            );


        if (!florActualizada) {

            return res.status(404).json({
                mensaje:
                    "Flor no encontrada"
            });
        }


        res.status(200).json(
            florActualizada
        );

    } catch (error) {

        console.error(
            "Error al actualizar flor:",
            error
        );


        res.status(500).json({
            mensaje:
                "Error al actualizar los precios"
        });
    }
};

export const cambiarEstadoFlor = async (
    req: Request,
    res: Response
) => {

    try {

        const id =
            req.params.id as string;

        const {
            activo
        } = req.body;


        if (typeof activo !== "boolean") {

            return res.status(400).json({
                mensaje:
                    "Debes indicar si la flor está activa o inactiva"
            });
        }


        const florActualizada =
            await actualizarEstadoFlor(
                id,
                activo
            );


        if (!florActualizada) {

            return res.status(404).json({
                mensaje:
                    "Flor no encontrada"
            });
        }


        res.status(200).json(
            florActualizada
        );


    } catch (error) {

        console.error(
            "Error al cambiar estado:",
            error
        );


        res.status(500).json({
            mensaje:
                "Error al cambiar el estado de la flor"
        });
    }
};