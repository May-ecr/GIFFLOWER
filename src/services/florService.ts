import Flor from "../models/florModel";


// ======================================================
// FLORES ACTIVAS
// Se utilizan en el cotizador
// ======================================================

export const obtenerFlores = async () => {

    return await Flor
        .find({ activo: true })
        .sort({ nombre: 1 });

};


// ======================================================
// CATÁLOGO COMPLETO
// Incluye activas e inactivas
// ======================================================

export const obtenerCatalogoFlores = async () => {

    return await Flor
        .find()
        .sort({ nombre: 1 });

};


// ======================================================
// CREAR UNA FLOR NUEVA
// ======================================================

export const crearFlor = async (
    nombre: string,
    precio: number,
    precioLista: number
) => {

    const nuevaFlor = new Flor({
        nombre,
        precio,
        precioLista,
        activo: true
    });


    return await nuevaFlor.save();
};


// ======================================================
// ACTUALIZAR PRECIOS
// ======================================================

export const actualizarPrecioFlor = async (
    id: string,
    precio: number,
    precioLista: number
) => {

    return await Flor.findByIdAndUpdate(
        id,
        {
            precio,
            precioLista
        },
        {
            new: true,
            runValidators: true
        }
    );

};
export const actualizarEstadoFlor = async (
    id: string,
    activo: boolean
) => {

    return await Flor.findByIdAndUpdate(
        id,
        {
            activo
        },
        {
            new: true,
            runValidators: true
        }
    );
};