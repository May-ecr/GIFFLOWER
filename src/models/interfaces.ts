export interface Paquete {
    nombre: string;
    cantidad: number;
    precioCompra: number;
    precioLista: number;
}

export interface Cotizacion {
    descuento: number;
    flete?: number;
    paquetes: Paquete[];
}

export interface PaqueteCalculado {
    nombre: string;
    cantidad: number;
    costoPaquete: number;
    ventaPaquete: number;
    utilidad: number;
}

export interface ResultadoCotizacion {
    costoTotal: number;
    ventaBruta: number;
    descuento: number;
    ventaFinal: number;
    flete: number;
    utilidadTotal: number;
    paquetes: PaqueteCalculado[];
}