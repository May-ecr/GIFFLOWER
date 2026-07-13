import { Request, Response } from "express";
import { realizarCalculos } from "../services/cotizacionService";

export const calcularCotizacion = (req: Request, res: Response) => {

    const resultado = realizarCalculos(req.body);

    res.json(resultado);

};