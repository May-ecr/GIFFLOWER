import mongoose, { Schema, Document } from "mongoose";
import { PaqueteCalculado } from "./interfaces";

export interface IHistorial extends Document {
    fecha: Date;
    subtotal: number;
    descuento: number;
    total: number;
    utilidadTotal: number;
    paquetes: PaqueteCalculado[];
}

const historialSchema = new Schema<IHistorial>(
    {
        fecha: {
            type: Date,
            default: Date.now
        },

        subtotal: {
            type: Number,
            required: true
        },

        descuento: {
            type: Number,
            required: true
        },

        total: {
            type: Number,
            required: true
        },

        utilidadTotal: {
            type: Number,
            required: true
        },

        paquetes: [
            {
                nombre: {
                    type: String,
                    required: true
                },

                costoPaquete: {
                    type: Number,
                    required: true
                },
                precioVenta: {
                    type: Number,
                    required: true
                },
                utilidad: {
                    type: Number,
                    required: true
                }
            }
        ]
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IHistorial>(
    "Historial",
    historialSchema, 
    "historial"
);