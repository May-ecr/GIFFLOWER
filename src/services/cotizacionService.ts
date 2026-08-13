import {
    Cotizacion,
    Paquete,
    ResultadoCotizacion
} from "../models/interfaces";

export function realizarCalculos(
    data: Cotizacion
): ResultadoCotizacion {

    let costoTotal = 0;
    let ventaBruta = 0;

    const paquetes = data.paquetes.map((paquete: Paquete) => {

        // Lo que le cuesta a la florería
        const costoPaquete =
            paquete.cantidad * paquete.precioCompra;

        // Lo que pagaría el cliente
        const ventaPaquete =
            paquete.cantidad * paquete.precioLista;

        // Utilidad individual antes de descuento/flete
        const utilidad =
            ventaPaquete - costoPaquete;

        costoTotal += costoPaquete;
        ventaBruta += ventaPaquete;

        return {
            nombre: paquete.nombre,
            cantidad: paquete.cantidad,
            costoPaquete,
            ventaPaquete,
            utilidad
        };
    });
    if (data.descuento < 0 || data.descuento > 35) {
        throw new Error(
            "El descuento debe estar entre 0% y 35%"
        );
    }
    // El porcentaje de descuento lo decide el encargado
    const porcentajeDescuento = data.descuento || 0;

    // El descuento se aplica sobre lo que pagaría el cliente
    const descuento =
        ventaBruta * (porcentajeDescuento / 100);

    // Lo que realmente pagará el cliente
    const ventaFinal =
        ventaBruta - descuento;

    /*
     * Si posteriormente mandamos el flete desde el frontend,
     * se utilizará ese valor.
     *
     * Mientras tanto se consideran $100.
     */
    const flete =
        data.flete ?? 100;

    // Ganancia real
    const utilidadTotal =
        ventaFinal - costoTotal - flete;

    return {
        cliente: data.cliente,
        costoTotal,
        ventaBruta,
        descuento,
        ventaFinal,
        flete,
        utilidadTotal,
        paquetes
    };
}