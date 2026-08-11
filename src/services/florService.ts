import Flor from "../models/florModel";

//se buscan todas las flores que se tengan
export const obtenerFlores = async () => {
    return await Flor.find({ activo: true });
};

//sirve para agregar flores nuevas a la base de datos
export const crearFlor = async (
    nombre: string,
    costoUnitario: number
) => {
    const nuevaFlor = new Flor({
        nombre,
        costoUnitario
    });

    return await nuevaFlor.save();
};

//si el precio cambia aqui se puede actualizar
export const actualizarPrecioFlor = async (
    id: string,
    costoUnitario: number
) => {
    return await Flor.findByIdAndUpdate(
        id,
        {
            costoUnitario
        },
        {
            new: true
        }
    );
};