//sirve para definir como se van a guardar las flores en la base de datos
import mongoose, { Schema, Document } from "mongoose";

export interface IFlor extends Document {
    nombre: string;
    costoUnitario: number;
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

        costoUnitario: {
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

export default mongoose.model<IFlor>("Flor", FlorSchema);