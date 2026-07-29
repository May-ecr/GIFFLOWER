import ExcelJS from "exceljs";

export async function generarExcel(resultado: any): Promise<Buffer> {

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "GIFFLOWER";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Cotización");

    // ===== Título =====

    worksheet.mergeCells("A1:D1");

    const titulo = worksheet.getCell("A1");

    titulo.value = "COTIZACIÓN";

    titulo.font = {
        bold: true,
        size: 18
    };

    worksheet.addRow([]);

    // ===== Encabezados =====

    const encabezado = worksheet.addRow([
        "Paquete",
        "Costo",
        "Precio Venta",
        "Utilidad"
    ]);

    encabezado.font = {
        bold: true
    };

    // ===== Datos =====

    resultado.paquetes.forEach((paquete: any) => {

        worksheet.addRow([
            paquete.nombre,
            paquete.costoPaquete,
            paquete.precioVenta,
            paquete.utilidad
        ]);

    });

    worksheet.addRow([]);

    worksheet.addRow(["Subtotal", resultado.subtotal]);
    worksheet.addRow(["Descuento", resultado.descuento]);
    worksheet.addRow(["Total", resultado.total]);
    worksheet.addRow(["Utilidad Total", resultado.utilidadTotal]);

   worksheet.columns = [
    { width: 30 },
    { width: 20 },
    { width: 20 },
    { width: 20 }
];

    return Buffer.from(await workbook.xlsx.writeBuffer());

}