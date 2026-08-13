// Define cómo se guardan las flores en MongoDB

import mongoose, { Schema, Document } from "mongoose";


export interface IFlor extends Document {
    nombre: string;

    // Precio que le cuesta a la florería
    precio: number;

    // Precio al que se vende
    precioLista: number;

    activo: boolean;
}


const FlorSchema: Schema = new Schema(
    {
        nombre: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        precio: {
            type: Number,
            required: true,
            min: 0
        },

        precioLista: {
            type: Number,
            required: true,
            min: 0
        },

        activo: {
            type: Boolean,
            default: true
        }
    },
    {
        versionKey: false
    }
);


export default mongoose.model<IFlor>(
    "Flor",
    FlorSchema
);