import Historial, { IHistorial } from "../models/historialModel";
import { ResultadoCotizacion } from "../models/interfaces";

export async function guardarHistorial(
    resultado: ResultadoCotizacion
): Promise<IHistorial> {
    const historial = new Historial(resultado);
    return await historial.save();
}

export async function obtenerHistorial(): Promise<IHistorial[]> {
    return await Historial.find().sort({ fecha: -1 });
}

export async function obtenerHistorialPorId(
    id: string
): Promise<IHistorial | null> {
    return await Historial.findById(id);
}

export async function eliminarHistorial(
    id: string
): Promise<IHistorial | null> {
    return await Historial.findByIdAndDelete(id);
}