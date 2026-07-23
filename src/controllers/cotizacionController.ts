import { Request, Response } from "express";
import { realizarCalculos } from "../services/cotizacionService";
import { guardarHistorial } from "../services/historialService";

export const calcularCotizacion = async(
    req: Request,
    res: Response
): Promise<void> => {

    try {

        console.log("1. Body recibido")
        const resultado = realizarCalculos(req.body);

        console.log("2. Cálculos realizados");
        await guardarHistorial(resultado);

        console.log("3. Historial guardado");
        res.status(200).json(resultado);

    } catch (error) {

        console.error("ERROR:", error);
        res.status(400).json({
            mensaje: "Error al procesar la cotización.",
            //detalle: error
            detalle: error instanceof Error ? error.message : error
        });

    }

};