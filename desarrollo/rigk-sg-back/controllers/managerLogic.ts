import { Request, Response } from "express";
import managerDao from '../dao/managerDao';
import { createLog } from "../helpers/createLog";
import ExcelJS from 'exceljs';
import establishmentDao from "../dao/establishmentDao";
import { string } from "joi";
import businessDao from "../dao/businessDao";
import { getReferenceExcel } from '../helpers/getExcelRef';
class ManagerLogic {
    async addManager(req: Request | any, res: Response) {
        const type_material = req.body.type_material;
        const region = req.body.region;
        const id_business = req.body.id_business
        try {
            await managerDao.addManager(type_material, region, id_business);
            await createLog('AGREGA_TIPO_MATERIAL', req.uid, null);
            res.status(200).json({ status: true, msg: 'Has creado un gestor', data: {} })
        }
        catch (err: any) {
            console.log(err);
            await createLog('AGREGA_TIPO_MATERIAL', req.uid, err.message);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }
    async getAllManager(req: any, res: Response) {
        try {
            const manager = await managerDao.getAllManager();
            res.status(200).json({ status: manager, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    async getManager(req: any, res: Response) {
        const id = req.params.id;
        try {
            const manager = await managerDao.getManager(id);
            res.status(200).json({ status: manager, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    async deleteManager(req: any, res: Response) {
        const id = req.params.id;
        try {
            const manager = await managerDao.deleteManager(id);
            await createLog('ELIMINA_TIPO_MATERIAL', req.uid, null);
            res.status(200).json({ status: manager, data: {}, msg: '' });
        } catch (err: any) {
            console.log(err);
            await createLog('ELIMINA_TIPO_MATERIAL', req.uid, err.message);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    async getAllMaterials(req: any, res: Response) {
        try {
            const material = await managerDao.getAllMaterials();
            res.status(200).json({ status: material, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    async getManagersByMaterial(req: any, res: Response) {
        const { type_material, region } = req.params;
        try {
            const material = await managerDao.getManagersByMaterial(type_material, region);
            res.status(200).json({ status: material, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    public async downloadBulkUploadFileInvoice(req: any, res: Response) {

        try {
            const path = require('path');
            const outputPath = path.join(__dirname, `../../files/templates/_carga_masiva_z.xlsx`);
            const invoices = await establishmentDao.getDeclarationEstablishment(req.uid);
            if (invoices == false) {
                return res.status(500).json({
                    status: false,
                    message: "No existen facturas pendientes"
                });
            }
            const noaprovediv = [...invoices].filter(i => i.STATE_GESTOR == 0);

            const businesses = await businessDao.getAllIndividualBusinessVAT();

            /**
             * DATA VALIDATION
             */

            const workbook = new ExcelJS.Workbook();

            const worksheetInfo = workbook.addWorksheet("info");

            const VATS = [];
            for (let i = 0; i < businesses.length; i++) {
                const business = businesses[i];
                VATS.push([`${business.VAT}`]);
            }

            worksheetInfo.addTable({
                name: 'VAT',
                ref: "A1",
                headerRow: true,
                columns: [
                    { name: 'VAT', filterButton: false },
                ],
                rows: VATS,
            });

            for (let i = 0; i < businesses.length; i++) {
                const business = await businesses[i];
                const reference = getReferenceExcel(i);
                let nameVAT = business.VAT;

                const emp = await businessDao.getBusinessByVAT(business.VAT);

                let empName = []
                for (let i = 0; i < emp.length; i++) {
                    const empresa = emp[i];
                    empName.push([`${empresa.NAME}`])
                }

                worksheetInfo.addTable({
                    name: nameVAT,
                    ref: reference,
                    headerRow: true,
                    columns: [
                        { name: nameVAT, filterButton: false },
                    ],
                    rows: empName,
                });
            }

            worksheetInfo.state = "veryHidden";

            // /**
            //  * WORKSHEET DATA
            //  */

            const worksheet = workbook.addWorksheet('Carga Masiva');
            const row = worksheet.getRow(1);
            row.getCell(1).value = "EMPRESA CI";
            row.getCell(2).value = "ESTABLECIMIENTO";
            row.getCell(3).value = "TIPO TRATAMIENTO";
            row.getCell(4).value = "MATERIAL";
            row.getCell(5).value = "SUBTIPO";
            row.getCell(6).value = "FECHA RETIRO";
            row.getCell(7).value = "NÚM. FACTURA RECICLADOR";
            row.getCell(8).value = "RUT RECICLADOR";
            row.getCell(9).value = "RECICLADOR";
            row.getCell(10).value = "FECHA INGRESO PR";
            row.getCell(11).value = "PESO TOTAL";
            row.getCell(12).value = "PESO DECLARADO";
            row.getCell(13).value = "PESO VALORIZADO";
            row.commit();

            const col = worksheet.columns;
            col[0].width = 23, 43;      //A
            col[1].width = 36;          //B
            col[2].width = 21, 14;      //C
            col[3].width = 12;          //D
            col[4].width = 33, 71;      //E
            col[5].width = 12, 71;      //F
            col[6].width = 25, 71;      //G
            col[7].width = 15, 14;      //H
            col[8].width = 22, 86;      //I
            col[9].width = 17, 14;      //J
            col[10].width = 10, 86;     //K
            col[11].width = 17;         //L
            col[12].width = 17;         //M
            
            for (let i = 0; i < noaprovediv.length; i++) {
                const invoice = noaprovediv[i];
                if (invoice.STATE_GESTOR == 0) {
                    const dateFormat = new Date(invoice.FechaRetiro);

                    let day = dateFormat.getDate();
                    let month = dateFormat.getMonth();
                    let year = dateFormat.getFullYear();

                    let monthWithTwoDigits = month.toString().padStart(2, '0');
                    let dayWithTwoDigits = day.toString().padStart(2, '0');
                    let format1 = dayWithTwoDigits + "/" + monthWithTwoDigits + "/" + year;

                    const rowdata = worksheet.getRow(i + 2);
                    rowdata.getCell(1).value = `${invoice.NAME_BUSINESS}`;
                    rowdata.getCell(2).value = `${invoice.NAME_ESTABLISHMENT_REGION}`;
                    rowdata.getCell(3).value = `${invoice.TipoTratamiento}`;
                    rowdata.getCell(4).value = `${invoice.PRECEDENCE}`;
                    rowdata.getCell(5).value = `${invoice.TYPE_RESIDUE}`;
                    rowdata.getCell(6).value = `${format1}`;
                    rowdata.getCell(7).value = "";
                    rowdata.getCell(8).value = "";
                    rowdata.getCell(9).value = "";
                    rowdata.getCell(10).value = "";
                    rowdata.getCell(11).value = "";
                    rowdata.getCell(12).value = `${invoice.VALUE}`;
                    rowdata.getCell(13).value = "";
                    rowdata.getCell(14).value = `${invoice.ID_DETAIL}`;
                    rowdata.commit();
                }
            }

            const VATdropdown = ["Info!$A$2:$A$" + VATS.length];

            for (let i = 1; i <= noaprovediv.length; i++) {
                worksheetInfo.getRow(1).getCell(2);

                worksheet.getCell(`J${i + 1}`).dataValidation = {
                    type: 'textLength',
                    allowBlank: false,
                    operator: 'between',
                    showErrorMessage: true,
                    errorStyle: 'error',
                    errorTitle: 'Formato de Fecha Inválido',
                    error: 'Por favor, ingrese una fecha válida en formato DD/MM/AAAA.',
                    formulae: [10, 10]
                };
                worksheet.getCell(`J${i + 1}`).numFmt = '@';;
                worksheet.getCell(`H${i + 1}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    formulae: VATdropdown
                };
                ///METODO PROPIO
                worksheet.getCell(`I${i + 1}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    formulae: [`=INDIRECT("_"&SUBSTITUTE(H${i + 1},"-","_"))`],
                };
                worksheet.getCell(`K${i + 1}`).numFmt = '@';
                worksheet.getCell(`L${i + 1}`).numFmt = '@';
                worksheet.getCell(`M${i + 1}`).numFmt = '@';
            }

            const nameCol = worksheet.getColumn('N');
            nameCol.hidden = true;

            await workbook.xlsx.writeFile(outputPath);
            return res.download(outputPath);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
}
const managerLogic = new ManagerLogic();
export default managerLogic;