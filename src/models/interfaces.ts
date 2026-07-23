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

export interface PaqueteCalculado {
    nombre: string;
    costoPaquete: number;
    precioVenta: number;
    utilidad: number;
}

export interface ResultadoCotizacion {
    subtotal: number;
    descuento: number;
    total: number;
    utilidadTotal: number;
    paquetes: PaqueteCalculado[];
}