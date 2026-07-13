export function realizarCalculos(data: any) {

    let subtotal = 0;
    let utilidadTotal = 0;

    const paquetes = data.paquetes.map((paquete: any) => {

        let costoPaquete = 0;

        paquete.flores.forEach((flor: any) => {

            const costoFlor = flor.cantidad * flor.costoUnitario;

            costoPaquete += costoFlor;

        });

        const utilidad = paquete.precioVenta - costoPaquete;

        subtotal += costoPaquete;

        utilidadTotal += utilidad;

        return {

            nombre: paquete.nombre,

            costoPaquete,

            precioVenta: paquete.precioVenta,

            utilidad

        };

    });

    const descuento = subtotal * (data.descuento / 100);

    const total = subtotal - descuento;

    return {

        subtotal,

        descuento,

        total,

        utilidadTotal,

        paquetes

    };

}