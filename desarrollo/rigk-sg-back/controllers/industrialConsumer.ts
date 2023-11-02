import { Request, Response } from "express";
import industrialConsumerDao from "../dao/industrialConsumerDao";
import establishmentDao from '../dao/establishmentDao';
import ExcelJS from 'exceljs';
import { createLog } from "../helpers/createLog";
import businessDao from "../dao/businessDao";
import managerDao from "../dao/managerDao";
class IndustrialConsumer {
    public async saveForm(req: any, res: Response) {
        const header = JSON.parse(req.body.header);
        const detail = JSON.parse(req.body.detail);
        const files = req.files;
        try {
            header.created_by = req['uid'];
            const id_header = await industrialConsumerDao.saveForm(header, detail, files);
            await createLog('ENVIO_DECLARACION_CI', req.uid, null);
            res.json({ status: true, data: id_header });
        } catch (error: any) {
            console.log(error);
            await createLog('ENVIO_DECLARACION_CI', req.uid, error.message);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    public async verifyRow(req: any, res: Response) {
        const { treatment, sub, gestor, date, idEstablishment } = req.body;
        try {
            const data: any = await industrialConsumerDao.verifyRow(treatment, sub, gestor, date, idEstablishment);
            if (data.length > 0) {
                return res.json({
                    status: false
                })
            }
            return res.json({
                status: true
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    public async saveFile(req: any, res: Response) {
        const { idDetail, fileName, typeFile } = req.body;
        const fileBuffer = req.files.fileBuffer.data;
        try {
            await createLog('AGREGA_MEDIO_VERIFICACION_DECLARACION_CI', req.uid, null);
            const id_header = await industrialConsumerDao.saveFile(idDetail, fileName, fileBuffer, typeFile);
            res.json({ status: true, data: id_header });
        } catch (error: any) {
            console.log(error);
            await createLog('AGREGA_MEDIO_VERIFICACION_DECLARACION_CI', req.uid, error.message);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    public async saveHeaderData(req: any, res: Response) {
        const { establishmentId, createdBy, createdAt, updatedAt, yearStatement } = req.body;

        try {
            const idHeader = await industrialConsumerDao.saveHeaderData(
                establishmentId,
                createdBy,
                createdAt,
                yearStatement
            );
            await createLog('ENVIO_MASIVO_DECLARACION_CI', req.uid, null);
            res.json({ status: true, data: idHeader });
        } catch (error: any) {
            console.log(error);
            await createLog('ENVIO_MASIVO_DECLARACION_CI', req.uid, error.message);
            res.status(500).json({
                status: false,
                message: "Algo salió mal",
            });
        }
    }

    public async saveDetailData(req: any, res: Response) {
        const { ID_HEADER, PRECEDENCE, TYPE_RESIDUE, VALUE, DATE_WITHDRAW, ID_GESTOR, LER, TREATMENT_TYPE } = req.body;

        try {
            const idDetail = await industrialConsumerDao.saveDetailData(
                ID_HEADER,
                PRECEDENCE,
                TYPE_RESIDUE,
                VALUE,
                DATE_WITHDRAW,
                ID_GESTOR,
                LER,
                TREATMENT_TYPE
            );
            //   await createLog('ENVIO_DECLARACION_CI', req.uid, null);
            res.json({ status: true, data: idDetail });
        } catch (error: any) {
            console.log(error);
            //   await createLog('OC_PRODUCTOR', req.uid, error);
            res.status(500).json({
                status: false,
                message: "Algo salió mal",
            });
        }
    }
    async downloadFile(req: any, res: Response) {
        const id = req.params.id;
        try {
            const fileData = await industrialConsumerDao.downloadFile(id);
            if (fileData) {
                const fileContent = Buffer.from(fileData.fileContent, 'binary');

                res.setHeader('Content-Type', fileData.fileType);
                res.setHeader('Content-Disposition', `attachment; filename=${fileData.fileName}`);
                res.send(fileContent);
            } else {
                res.status(404).json({ status: false, message: 'Archivo no encontrado' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: 'Algo salió mal',
            });
        }
    }
    public async getMV(req: any, res: Response) {
        const { id } = req.params;
        try {
            const id_header = await industrialConsumerDao.getMV(id);
            res.json({ status: true, data: id_header });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    public async deleteById(req: any, res: Response) {
        const { id } = req.params;
        try {
            await createLog('ELIMINA_MEDIO_VERIFICACION_DECLARACION_CI', req.uid, null);
            const id_header = await industrialConsumerDao.deleteById(id);
            res.json({ status: true, data: id_header });
        } catch (error: any) {
            console.log(error);
            await createLog('ELIMINA_MEDIO_VERIFICACION_DECLARACION_CI', req.uid, error.message);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    public async getForm(req: any, res: Response) {
        const { id } = req.params;
        try {
            const data = await industrialConsumerDao.getForm(id);
            res.json({ status: true, data });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    public async getFormConsulta(req: any, res: Response) {
        const { id } = req.params;
        try {
            const data = await industrialConsumerDao.getFormConsulta(id);
            res.json({ status: true, data });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    public async verify(req: any, res: Response) {
        const { year, business } = req.params;
        try {
            const data = await industrialConsumerDao.verify(year, business);
            res.status(200).json({ status: data });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    async getDeclarationByID(req: any, res: Response) {
        const id_header = req.params.id_header
        const id_detail = req.params.id_detail
        try {
            const establishment = await industrialConsumerDao.getDeclarationByID(id_header, id_detail);
            res.status(200).json({ status: establishment, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    public async downloadBulkUploadFile(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const path = require('path');
            const outputPath = path.join(__dirname, `../../files/templates/_carga_masiva_${id}.xlsx`);
            const establishments = await establishmentDao.getEstablishment(id);
            if (establishments == false) {
                return res.status(500).json({
                    status: false,
                    message: "Empresa sin establecimientos"
                });
            }
            const workbook = new ExcelJS.Workbook();
            const worksheetInfo = workbook.addWorksheet('Info');
            const rowInfo = worksheetInfo.getRow(1);
            rowInfo.getCell(1).value = "CODIGO";

            for (let i = 0; i < establishments.length; i++) {
                const establishment = establishments[i];
                const rowInfo = worksheetInfo.getRow(i + 2);
                rowInfo.getCell(1).value = `${establishment.ID_VU} - ${establishment.REGION} - ${establishment.NAME_COMMUNE} - ${establishment.NAME_ESTABLISHMENT}`;
            }
            rowInfo.commit();

            const materials = await managerDao.getAllMaterials();
            const materialNames = materials.map((material: any) => [material.MATERIAL]);
            const treatments = await managerDao.getAllTreatments();
            const treatmentsNames = treatments.map((treatments: any) => [treatments.NAME]);
            const allManagers = await managerDao.getAllManager();
            const establishmentRegions = establishments.map((establishment: any) => establishment.REGION);
            const filteredManagers = allManagers.filter((manager: any) => establishmentRegions.includes(manager.REGION));
            function createExcelTableForMaterial(material: any, columnRef: any) {
                material.material_name = material.material_name.replace(/\//g, '_');
                return {
                    name: material.material_name,
                    ref: columnRef + 1,
                    headerRow: true,
                    columns: [
                        { name: material.material_name, filterButton: false },
                    ],
                    rows: material.child.map((submaterial: any) => [submaterial.name])
                };
            }

            const materialsFormatted = await managerDao.getMaterialsFormatted();
            let currentColumnRef = 'D';

            materialsFormatted.forEach((material: any) => {
                const table = createExcelTableForMaterial(material, currentColumnRef);
                worksheetInfo.addTable(table);
                currentColumnRef = String.fromCharCode(currentColumnRef.charCodeAt(0) + 1);
            });

            worksheetInfo.addTable({
                name: 'Residuos',
                ref: 'B1',
                headerRow: true,
                columns: [
                    { name: 'Residuos', filterButton: false },
                ],
                rows: materialNames
            });
            worksheetInfo.addTable({
                name: 'TIPO_TRATAMIENTO',
                ref: 'C1',
                headerRow: true,
                columns: [
                    { name: 'TIPO TRATAMIENTO', filterButton: false },
                ],
                rows: treatmentsNames
            });

            const colInfo = worksheetInfo.columns;
            colInfo[0].width = 9;
            colInfo[1].width = 25;
            colInfo[2].width = 25;
            worksheetInfo.state = 'veryHidden';

            const info = await businessDao.getBusinessById(id);
            const worksheet = workbook.addWorksheet('Carga Masiva');
            const row = worksheet.getRow(3);
            worksheet.getRow(1).getCell(1).value = "RUT";
            worksheet.getRow(1).getCell(2).value = info[0].VAT;
            worksheet.getRow(2).getCell(1).value = "RAZÓN SOCIAL";
            worksheet.getRow(2).getCell(2).value = info[0].CODE_BUSINESS + " - " + info[0].NAME;

            worksheet.getCell(`B1`).dataValidation = {
                type: 'textLength',
                allowBlank: false,
                showErrorMessage: true,
                error: 'No se puede editar',
                formulae: [10, 10]
            };

            worksheet.getCell(`B2`).dataValidation = {
                type: 'textLength',
                allowBlank: false,
                showErrorMessage: true,
                error: 'No se puede editar',
                formulae: [10, 10]
            };

            row.getCell(1).value = "ID VU ESTABLECIMIENTO";
            row.getCell(2).value = "SUBCATEGORIA";
            row.getCell(3).value = "TIPO TRATAMIENTO";
            row.getCell(4).value = "SUBTIPO";
            row.getCell(5).value = "FECHA DE RETIRO";
            row.getCell(6).value = "NUM GUIA DESPACHO";
            row.getCell(7).value = "RUT GESTOR";
            row.getCell(8).value = "NOMBRE GESTOR";
            row.getCell(9).value = "ID VU GESTOR";
            row.getCell(10).value = "CANTIDAD (KG)";
            row.commit();
            const col = worksheet.columns;
            col[0].width = 26;
            col[1].width = 26;
            col[2].width = 26;
            col[3].width = 26;
            col[4].width = 26;
            col[5].width = 26;
            col[6].width = 26;
            col[7].width = 26;
            col[8].width = 26;
            col[9].width = 26;

            const maxRows = 150;
            const lastRowMaterials = 1 + materialNames.length;
            const lastRowTreatments = 1 + treatmentsNames.length;
            const uniqueCombinations_2:any = {};
            const uniqueCombinations_3:any = {};

            const uniqueCombinedRutNames = filteredManagers.reduce((uniqueArr: any[], manager: any) => {
                const rut = `${manager.VAT} - ${manager.REGION}`; 
                const material = manager.MATERIAL_NAME; 
                const name = manager.BUSINESS_NAME; 
                const key = `${rut}|${material}|${name}`;  

                if (!uniqueCombinations_2[key]) {
                    uniqueCombinations_2[key] = true;
                    uniqueArr.push([rut, manager.BUSINESS_NAME, manager.REGION, material]);
                }
                return uniqueArr;
            }, []);

            const uniqueCombinedRutNames_2 = filteredManagers.reduce((uniqueArr: any[], manager: any) => {
                const rut = `${manager.VAT} - ${manager.REGION}`; 
                const material = manager.MATERIAL_NAME; 
                const name = manager.BUSINESS_NAME; 
                const key = `${rut}|${material}|${name}`;  

                if (!uniqueCombinations_3[key]) {
                    uniqueCombinations_3[key] = true;
                    uniqueArr.push([rut, manager.BUSINESS_NAME, manager.REGION, material]);
                }
                return uniqueArr;
            }, []);

            const originalArray = [...uniqueCombinedRutNames_2];

            uniqueCombinedRutNames.unshift(['1 - Reciclador Interno', 'Reciclador Interno', '', 'Papel/Cartón']);
            uniqueCombinedRutNames.unshift(['1 - Reciclador Interno', 'Reciclador Interno', '', 'Metal']);
            uniqueCombinedRutNames.unshift(['1 - Reciclador Interno', 'Reciclador Interno', '', 'Plástico']);
            uniqueCombinedRutNames.unshift(['1 - Reciclador Interno', 'Reciclador Interno', '', 'Madera']);
            uniqueCombinedRutNames.unshift(['1 - Reciclador Interno', 'Reciclador Interno', '', 'Mezclados']);

            uniqueCombinedRutNames.sort((a: string[], b: string[]) => {
                const materialA = a[3].toUpperCase();
                const materialB = b[3].toUpperCase();
                const materialOrder = ["PAPEL/CARTÓN", "METAL", "PLÁSTICO", "MADERA", "MEZCLADOS"];
                const indexA = materialOrder.indexOf(materialA);
                const indexB = materialOrder.indexOf(materialB);
                if (indexA === -1 || indexB === -1) return 0;

                return indexA - indexB;
            });

            const uniqueCombinations: any = {};
            const filteredArray = originalArray.filter(entry => {
                const name = entry[1].toUpperCase();
                const region = entry[2].toUpperCase();
                const key = `${name}|${region}`;  

                if (uniqueCombinations[key]) {
                    return false;
                } else {
                    uniqueCombinations[key] = true;
                    return true;
                }
            });

            filteredArray.unshift(['1 - Reciclador Interno', 'Reciclador Interno', '', 'Papel/Cartón']);
            filteredArray.unshift(['1 - Reciclador Interno', 'Reciclador Interno', '', 'Metal']);
            filteredArray.unshift(['1 - Reciclador Interno', 'Reciclador Interno', '', 'Plástico']);
            filteredArray.unshift(['1 - Reciclador Interno', 'Reciclador Interno', '', 'Madera']);
            filteredArray.unshift(['1 - Reciclador Interno', 'Reciclador Interno', '', 'Mezclados']);
            const sortedByRutRegionAndName = [...filteredArray].sort((a, b) => {
                const rutRegionA = a[0].toUpperCase();
                const rutRegionB = b[0].toUpperCase();
                if (rutRegionA < rutRegionB) {
                    return -1;
                } else if (rutRegionA > rutRegionB) {
                    return 1;
                } else {
                    const nameA = a[1].toUpperCase();
                    const nameB = b[1].toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    } else if (nameA > nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            });

            worksheetInfo.addTable({
                name: 'RUTsNames',
                ref: 'I1',
                headerRow: true,
                columns: [
                    { name: 'RUTs', filterButton: false },
                    { name: 'Names', filterButton: false },
                    { name: 'REGIONES', filterButton: false },
                    { name: 'MATERIALES', filterButton: false },
                ],
                rows: uniqueCombinedRutNames
            });

            worksheetInfo.addTable({
                name: 'RutsSorted',
                ref: 'M1',
                headerRow: true,
                columns: [
                    { name: 'RutSorted', filterButton: false },
                    { name: 'NameSorted', filterButton: false },
                    { name: 'REGIONESSorted', filterButton: false },
                    { name: 'MATERIALESSorted', filterButton: false },
                ],
                rows: sortedByRutRegionAndName
            });


            for (let i = 1; i <= maxRows; i++) {
                worksheet.getCell(`A${i + 3}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    showErrorMessage: true,
                    error: 'Por favor ingresar un Código de Establecimiento válido',
                    formulae: [`Info!$A$2:$A$${establishments.length + 1}`]
                };
                worksheet.getCell(`B${i + 3}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    showErrorMessage: true,
                    error: 'Por favor selecciona un material válido.',
                    formulae: [`Info!$B$2:$B$${lastRowMaterials}`]
                };
                worksheet.getCell(`C${i + 3}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    showErrorMessage: true,
                    error: 'Por favor selecciona un tratamiento válido.',
                    formulae: [`Info!$C$2:$C$${lastRowTreatments}`]
                };
                worksheet.getCell(`D${i + 3}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    showErrorMessage: true,
                    error: 'Por favor selecciona un subtipo válido.',
                    formulae: [`=INDIRECT(SUBSTITUTE(B${i + 3}, "/", "_"))`]
                };
                worksheet.getCell(`E${i + 3}`).dataValidation = {
                    type: 'textLength',
                    allowBlank: false,
                    operator: 'between',
                    showErrorMessage: true,
                    errorStyle: 'error',
                    errorTitle: 'Formato de fecha inválido',
                    error: 'Por favor, ingrese una fecha válida en formato DD/MM/AAAA',
                    formulae: [10, 10]
                };
                worksheet.getCell(`E${i + 3}`).numFmt = '@';
                worksheet.getCell(`G${i + 3}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    showErrorMessage: true,
                    error: 'Por favor selecciona un RUT válido.',
                    formulae: [`=IF(OR(B${i + 3}="", A${i + 3}=""), "", OFFSET(INDIRECT("Info!$I$2"),MATCH(B${i + 3},INDIRECT("Info!$L$2:$L$"&${uniqueCombinedRutNames.length + 1}),0)-1,0,COUNTIF(INDIRECT("Info!$L$2:$L$"&${uniqueCombinedRutNames.length + 1}),B${i + 3})))`]
                };
                worksheet.getCell(`H${i + 3}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    showErrorMessage: true,
                    error: 'Por favor selecciona un nombre válido.',
                    formulae: [`=IF(G${i + 3}="1 - Reciclador Interno", Info!$N$2, OFFSET(Info!$N$2,MATCH(G${i + 3},Info!$M$2:$M$${uniqueCombinedRutNames.length + 1},0)-1,0,COUNTIF(Info!$M$2:$M$${uniqueCombinedRutNames.length + 1},G${i + 3})))`]
                };
                worksheet.getCell(`J${i + 1}`).numFmt = '@';
            }
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
const industrialConsumer = new IndustrialConsumer();
export default industrialConsumer;