import { Request, Response } from "express";
import { realizarCalculos } from "../services/cotizacionService";
import { generarExcel } from "../services/excelService";

export const descargarExcel = async (
    req: Request,
    res: Response
) => {

    try {

        const resultado = realizarCalculos(req.body);

        const excel = await generarExcel(resultado);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="cotizacion.xlsx"'
        );

        res.send(excel);

    } catch (error) {

        return res.status(400).json({
            mensaje: "Error al generar el Excel.",
            detalle: error
        });

    }

};