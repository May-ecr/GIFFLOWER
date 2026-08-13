import mongoose, { Schema, Document } from "mongoose";
import { PaqueteCalculado } from "./interfaces";


export interface IHistorial extends Document {
    cliente: string;
    
    fecha: Date;

    costoTotal: number;

    ventaBruta: number;

    descuento: number;

    ventaFinal: number;

    flete: number;

    utilidadTotal: number;

    paquetes: PaqueteCalculado[];
}


const historialSchema = new Schema<IHistorial>(
    {
        cliente:{
            type: String,
            required: true,
            trim: true
        },
        
        fecha: {
            type: Date,
            default: Date.now
        },


        // ==========================================
        // COSTO TOTAL DE LA MERCANCÍA
        // ==========================================

        costoTotal: {
            type: Number,
            required: true
        },


        // ==========================================
        // TOTAL ANTES DEL DESCUENTO
        // ==========================================

        ventaBruta: {
            type: Number,
            required: true
        },


        // ==========================================
        // CANTIDAD DESCONTADA AL CLIENTE
        // ==========================================

        descuento: {
            type: Number,
            required: true
        },


        // ==========================================
        // LO QUE REALMENTE PAGA EL CLIENTE
        // ==========================================

        ventaFinal: {
            type: Number,
            required: true
        },


        // ==========================================
        // GASTO DE FLETE
        // ==========================================

        flete: {
            type: Number,
            required: true
        },


        // ==========================================
        // GANANCIA FINAL
        // ==========================================

        utilidadTotal: {
            type: Number,
            required: true
        },


        // ==========================================
        // PAQUETES / FLORES DE LA COTIZACIÓN
        // ==========================================

        paquetes: [
            {
                nombre: {
                    type: String,
                    required: true
                },


                cantidad: {
                    type: Number,
                    required: true
                },


                costoPaquete: {
                    type: Number,
                    required: true
                },


                ventaPaquete: {
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