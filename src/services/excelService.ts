import ExcelJS from "exceljs";
import { ResultadoCotizacion } from "../models/interfaces";


export async function generarExcel(
    resultado: ResultadoCotizacion
): Promise<Buffer> {

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "GIFFLOWER";
    workbook.created = new Date();


    const worksheet =
        workbook.addWorksheet("Cotización");


    // =====================================================
    // TÍTULO
    // =====================================================

    worksheet.mergeCells("A1:E1");

    const titulo =
        worksheet.getCell("A1");

    titulo.value = "COTIZACIÓN";

    titulo.font = {
        bold: true,
        size: 18
    };

    titulo.alignment = {
        horizontal: "center"
    };


    worksheet.addRow([]);


    // =====================================================
    // ENCABEZADOS
    // =====================================================

    const encabezado =
        worksheet.addRow([
            "Flor",
            "Cantidad",
            "Costo Total",
            "Venta Total",
            "Utilidad"
        ]);


    encabezado.font = {
        bold: true
    };


    encabezado.alignment = {
        horizontal: "center"
    };


    // =====================================================
    // DATOS DE CADA FLOR
    // =====================================================

    resultado.paquetes.forEach((paquete) => {

        worksheet.addRow([
            paquete.nombre,
            paquete.cantidad,
            paquete.costoPaquete,
            paquete.ventaPaquete,
            paquete.utilidad
        ]);

    });


    // =====================================================
    // ESPACIO
    // =====================================================

    worksheet.addRow([]);


    // =====================================================
    // RESUMEN
    // =====================================================

    const filaCosto =
        worksheet.addRow([
            "Costo de mercancía",
            resultado.costoTotal
        ]);


    const filaVentaBruta =
        worksheet.addRow([
            "Venta antes de descuento",
            resultado.ventaBruta
        ]);


    const filaDescuento =
        worksheet.addRow([
            "Descuento",
            resultado.descuento
        ]);


    const filaVentaFinal =
        worksheet.addRow([
            "Venta final",
            resultado.ventaFinal
        ]);


    const filaFlete =
        worksheet.addRow([
            "Flete",
            resultado.flete
        ]);


    const filaUtilidad =
        worksheet.addRow([
            "Utilidad total",
            resultado.utilidadTotal
        ]);


    // =====================================================
    // FORMATO DEL RESUMEN
    // =====================================================

    filaCosto.getCell(1).font = {
        bold: true
    };

    filaVentaBruta.getCell(1).font = {
        bold: true
    };

    filaDescuento.getCell(1).font = {
        bold: true
    };

    filaVentaFinal.getCell(1).font = {
        bold: true
    };

    filaFlete.getCell(1).font = {
        bold: true
    };

    filaUtilidad.font = {
        bold: true
    };


    // =====================================================
    // FORMATO DE MONEDA EN LOS PAQUETES
    // =====================================================

    for (
        let fila = 4;
        fila <= 3 + resultado.paquetes.length;
        fila++
    ) {

        worksheet.getCell(`C${fila}`).numFmt =
            '$#,##0.00';

        worksheet.getCell(`D${fila}`).numFmt =
            '$#,##0.00';

        worksheet.getCell(`E${fila}`).numFmt =
            '$#,##0.00';

    }


    // =====================================================
    // FORMATO DE MONEDA EN EL RESUMEN
    // =====================================================

    [
        filaCosto,
        filaVentaBruta,
        filaDescuento,
        filaVentaFinal,
        filaFlete,
        filaUtilidad
    ].forEach((fila) => {

        fila.getCell(2).numFmt =
            '$#,##0.00';

    });


    // =====================================================
    // TAMAÑO DE COLUMNAS
    // =====================================================

    worksheet.columns = [

        {
            width: 30
        },

        {
            width: 15
        },

        {
            width: 20
        },

        {
            width: 20
        },

        {
            width: 20
        }

    ];


    // =====================================================
    // GENERAR ARCHIVO
    // =====================================================

    return Buffer.from(
        await workbook.xlsx.writeBuffer()
    );

}