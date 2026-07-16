export interface Flor {

    nombre: string;

    cantidad: number;

    costoUnitario: number;

}
export interface Paquete {

    nombre: string;

    precioVenta: number;

    flores: Flor[];

}
export interface Cotizacion {

    descuento: number;

    paquetes: Paquete[];

}