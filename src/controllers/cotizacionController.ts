import { Request, Response } from "express";
import { realizarCalculos } from "../services/cotizacionService";

export const calcularCotizacion = (
    req: Request,
    res: Response
) => {

    try {

        const resultado = realizarCalculos(req.body);

        return res.status(200).json(resultado);

    } catch (error) {

        return res.status(400).json({
            mensaje: "Error al procesar la cotización.",
            detalle: error
        });

    }

};