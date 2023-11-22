import { Request, Response } from "express";
import industrialConsumerDao from "../dao/industrialConsumerDao";
import establishmentDao from '../dao/establishmentDao';
import ExcelJS from 'exceljs';
import { createLog } from "../helpers/createLog";
import businessDao from "../dao/businessDao";
import managerDao from "../dao/managerDao";
import { calcularSumaPesoDeclarado , calcularSumaPesoNoValorizado, calcularSumaPesoValorizado , calcularSumaPesoRegion } from "../helpers/generateExcelCI";
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
            row.getCell(7).value = "GESTOR";
            row.getCell(8).value = "ID VU GESTOR";
            row.getCell(9).value = "CANTIDAD (KG)";
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

            const maxRows = 150;
            const lastRowMaterials = 1 + materialNames.length;
            const lastRowTreatments = 1 + treatmentsNames.length;
            const uniqueCombinations_2: any = {};
            const uniqueCombinations_3: any = {};

            const uniqueCombinedRutNames = filteredManagers.reduce((uniqueArr: any[], manager: any) => {
                const rut = `${manager.VAT} - ${manager.REGION} - ${manager.CODE_BUSINESS} - ${manager.BUSINESS_NAME}`;
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
                const rut = `${manager.VAT} - ${manager.REGION} - ${manager.CODE_BUSINESS} - ${manager.BUSINESS_NAME}`;
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
                const rutRegionA = a[0];
                const rutRegionB = b[0];
                if (rutRegionA < rutRegionB) return -1;
                if (rutRegionA > rutRegionB) return 1;
                return 0;
            });

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
                worksheet.getCell(`I${i + 1}`).numFmt = '@';
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

    public async downloadExcelDeclarationCI(req: Request, res: Response) {
        const { year } = req.params;
        try {
            const path = require('path');
            const outputPath = path.join(__dirname, `../../files/templates/Declaraciones_CI_YYYY.xlsx`);
            const workbook = new ExcelJS.Workbook();
            const worksheetDatos = workbook.addWorksheet('Datos');
            const response = await establishmentDao.getDeclarationEstablishmentExcelCI(year);
            const businessByRol = await establishmentDao.getBusinessByRolConsumidor();

            for (let i = 0; i < response.length; i++) {
                const invoice = response[i];

                const rowdata = worksheetDatos.getRow(i + 2);
                rowdata.getCell(1).value = `${invoice.ID_EMPRESA}`;
                rowdata.getCell(2).value = `${invoice.RUT_EMPRESA}`;
                rowdata.getCell(3).value = `${invoice.NOMBRE}`;
                rowdata.getCell(4).value = `${invoice.ESTABLECIMIENTO}`;
                rowdata.getCell(5).value = `${invoice.ID_VU}`;
                rowdata.getCell(6).value = `${invoice.REGION}`;
                rowdata.getCell(7).value = `${invoice.COMUNA}`;
                rowdata.getCell(8).value = `${invoice.ANO_DECLARACION}`;
                rowdata.getCell(9).value = `${invoice.ESTADO_DECLARACION}`;
                rowdata.getCell(10).value = `${invoice.SUBCATEGORIA}`;
                rowdata.getCell(11).value = `${invoice.TRATAMIENTO}`;
                rowdata.getCell(12).value = `${invoice.SUBTIPO}`;
                rowdata.getCell(13).value = `${parseFloat(invoice.PESO_DECLARADO.toFixed(2).replace(",", ".")).toString().replace(".", ',')}`;
                rowdata.getCell(14).value = invoice.PESO_VALORIZADO !== null ? `${parseFloat(invoice.PESO_VALORIZADO.toFixed(2).replace(",", ".")).toString().replace(".", ',')}` : ``;

                const fechaOriginal = new Date(invoice.FECHA_DE_RETIRO);

                const dia = fechaOriginal.getDate();
                const mes = fechaOriginal.getMonth() + 1;
                const año = fechaOriginal.getFullYear();
                const fechaFormateada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${año}`;

                rowdata.getCell(15).value = `${fechaFormateada}`;
                if (invoice.PESO_VALORIZADO !== null && invoice.ID_GESTOR == 0 && invoice.GESTOR == null && invoice.RUT_GESTOR == null) {
                    rowdata.getCell(16).value = `Reciclador Interno`;
                    rowdata.getCell(17).value = `1`;
                }
                if (invoice.PESO_VALORIZADO == null && invoice.ID_GESTOR == 0 && invoice.GESTOR == null && invoice.RUT_GESTOR == null) {
                    rowdata.getCell(16).value = `Reciclador Interno`;
                    rowdata.getCell(17).value = `1`;
                }
                if (invoice.PESO_VALORIZADO !== null && invoice.ID_GESTOR !== 0 && invoice.GESTOR !== null && invoice.RUT_GESTOR !== null) {
                    rowdata.getCell(16).value = `${invoice.GESTOR}`;
                    rowdata.getCell(17).value = `${invoice.RUT_GESTOR}`;
                }
                if (invoice.PESO_VALORIZADO == null && invoice.ID_GESTOR !== 0 && invoice.GESTOR !== null && invoice.RUT_GESTOR !== null) {
                    rowdata.getCell(16).value = `${invoice.GESTOR}`;
                    rowdata.getCell(17).value = `${invoice.RUT_GESTOR}`;
                }
                rowdata.getCell(18).value = `${invoice.USUARIO}`;
                rowdata.commit();
            }

            if (businessByRol) {
                const listaEmpresasConRol = businessByRol.res_business.filter((item2: { CODE_BUSINESS: any; }) => !response.some((item1: { ID_EMPRESA: any; }) => item1.ID_EMPRESA === item2.CODE_BUSINESS));
                for (let i = 0; i < listaEmpresasConRol.length; i++) {
                    const empresa = listaEmpresasConRol[i];

                    const rowdata = worksheetDatos.getRow(response.length + 2 + i);

                    rowdata.getCell(1).value = `${empresa.CODE_BUSINESS}`;
                    rowdata.getCell(2).value = `${empresa.VAT}`;
                    rowdata.getCell(3).value = `${empresa.NAME}`;
                    rowdata.getCell(4).value = ``;
                    rowdata.getCell(5).value = "";
                    rowdata.getCell(6).value = "";
                    rowdata.getCell(7).value = "";
                    rowdata.getCell(8).value = "";
                    rowdata.getCell(9).value = "";
                    rowdata.getCell(10).value = "";
                    rowdata.getCell(11).value = "";
                    rowdata.getCell(12).value = "";
                    rowdata.getCell(13).value = "";
                    rowdata.getCell(14).value = "";
                    rowdata.getCell(15).value = "";
                    rowdata.getCell(16).value = "";
                    rowdata.getCell(17).value = "";
                    rowdata.getCell(18).value = "";
                    rowdata.commit();
                }
            }

            const row = worksheetDatos.getRow(1);

            const col = worksheetDatos.columns;
            row.getCell(1).value = "ID empresa";
            col[0].width = 12;
            row.getCell(2).value = "RUT Empresa";
            col[1].width = 12;
            row.getCell(3).value = "Nombre empresa";
            col[2].width = 22;
            row.getCell(4).value = "Establecimiento";
            col[3].width = 22;
            row.getCell(5).value = "ID VU Establecimiento";
            col[4].width = 20;
            row.getCell(6).value = "Región";
            col[5].width = 20;
            row.getCell(7).value = "Comuna";
            col[6].width = 15;
            row.getCell(8).value = "Año declaración";
            col[7].width = 15;
            row.getCell(9).value = "Estado declaración";
            col[8].width = 16;
            row.getCell(10).value = "Subcategoria";
            col[9].width = 12;
            row.getCell(11).value = "Tratamiento";
            col[10].width = 22;
            row.getCell(12).value = "Subtipo";
            col[11].width = 22;
            row.getCell(13).value = "Peso declarado (kg)";
            col[12].width = 18;
            row.getCell(14).value = "Peso valorizado (kg)";
            col[13].width = 18;
            row.getCell(15).value = "Fecha de retiro";
            col[14].width = 15;
            row.getCell(16).value = "Gestor";
            col[15].width = 14;
            row.getCell(17).value = "RUT Gestor";
            col[16].width = 11;
            row.getCell(18).value = "Usuario";
            col[17].width = 20;
            row.commit();

            const worksheetResumen = workbook.addWorksheet('Resumen totalizadores');

            const nameCol = worksheetResumen.getColumn('A');
            const nameCol2 = worksheetResumen.getColumn('B');
            nameCol.width = 100;
            nameCol2.width = 15;
            nameCol2.alignment = {horizontal:"right"};

            worksheetResumen.getCell('A1').value = 'Notas: Todo en Toneladas. Totales anuales del año de ejercicio (año que se declara)';
            
            const uniqueID_EMPRESA = new Set(response.map((item: { ID_EMPRESA: any; }) => item.ID_EMPRESA));
            const EmpresasUnicas =  businessByRol ? uniqueID_EMPRESA.size + businessByRol.res_business.length : uniqueID_EMPRESA.size;
            // const EmpresasUnicas = uniqueID_EMPRESA.size;

            worksheetResumen.getCell('A3').value = 'Total CI';
            worksheetResumen.getCell('B3').value = EmpresasUnicas;

            worksheetResumen.getCell('A4').value = 'Total Establecimientos';
            const uniqueESTABLECIMIENTO = new Set(response.map((item: { ESTABLECIMIENTO: any; }) => item.ESTABLECIMIENTO));
            const EstablecimientosUnicos = uniqueESTABLECIMIENTO.size;
            worksheetResumen.getCell('B4').value = EstablecimientosUnicos;

            worksheetResumen.getCell('A5').value = 'Total Gestores';
            const gestoresUnicos = new Set();
            response.forEach((item: { GESTOR: any; RUT_GESTOR: any; }) => {
            const concatenacion = `${item.GESTOR}_${item.RUT_GESTOR}`;
            gestoresUnicos.add(concatenacion);
            });
            const cantidadTotalGestores = gestoresUnicos.size;
            worksheetResumen.getCell('B5').value = cantidadTotalGestores;

            worksheetResumen.getCell('A6').value = 'Peso Total Declarado';
            const pesoDeclaradoTotal = response.reduce((suma: any, item: { PESO_DECLARADO: any; }) => suma + item.PESO_DECLARADO, 0);
            worksheetResumen.getCell('B6').value = parseFloat(pesoDeclaradoTotal).toFixed(2).replace(",", ".").toString().replace(".", ',');

            worksheetResumen.getCell('A7').value = 'Peso Total Valorizado';
            const pesoValorizadoTotal = response.reduce((suma: any, item: { PESO_VALORIZADO: any; }) => suma + item.PESO_VALORIZADO, 0);
            worksheetResumen.getCell('B7').value = parseFloat(pesoValorizadoTotal).toFixed(2).replace(",", ".").toString().replace(".", ',');

            // -------------------------------------------------------------------

            worksheetResumen.getCell('A8').value = 'Total Reciclaje Papel/Cartón (Reciclaje Mecánico + Reciclaje Interno) ';
            worksheetResumen.getCell('B8').value = parseFloat(calcularSumaPesoDeclarado(response, "Papel/Cartón")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A9').value = 'Total Reciclaje Plástico (Reciclaje Mecánico + Reciclaje Interno) ';
            worksheetResumen.getCell('B9').value = parseFloat(calcularSumaPesoDeclarado(response, "Plástico")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A10').value = 'Total Reciclaje Metal (Reciclaje Mecánico + Reciclaje Interno) ';
            worksheetResumen.getCell('B10').value = parseFloat(calcularSumaPesoDeclarado(response, "Metal")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A11').value = 'Total Reciclaje Madera (Reciclaje Mecánico + Reciclaje Interno) ';
            worksheetResumen.getCell('B11').value = parseFloat(calcularSumaPesoDeclarado(response, "Madera")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A12').value = 'Total Reciclaje Mezclados (Reciclaje Mecánico + Reciclaje Interno) ';
            worksheetResumen.getCell('B12').value = parseFloat(calcularSumaPesoDeclarado(response, "Mezclados")).toFixed(2).replace(",", ".").toString().replace(".", ',');

            worksheetResumen.getCell('A13').value = 'Valorización Total Papel/Cartón (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B13').value = parseFloat(calcularSumaPesoValorizado(response, "Papel/Cartón")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A14').value = 'Valorización Total Plástico (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B14').value = parseFloat(calcularSumaPesoValorizado(response, "Plástico")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A15').value = 'Valorización Total Metal (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B15').value = parseFloat(calcularSumaPesoValorizado(response, "Metal")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A16').value = 'Valorización Total Madera (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B16').value = parseFloat(calcularSumaPesoValorizado(response, "Madera")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A17').value = 'Valorización Total Mezclados (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B17').value = parseFloat(calcularSumaPesoValorizado(response, "Mezclados")).toFixed(2).replace(",", ".").toString().replace(".", ',');

            worksheetResumen.getCell('A18').value = 'Total no valorizado Papel/Cartón (Disposicion Final en RS +  DF en Relleno Seguridad)';
            const sumaPapelCarton = calcularSumaPesoNoValorizado(response, "Papel/Cartón");
            worksheetResumen.getCell('B18').value = parseFloat(sumaPapelCarton).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A19').value = 'Total no valorizado Plastico (Disposicion Final en RS + DF en Relleno Seguridad)';
            const sumaPlastico = calcularSumaPesoNoValorizado(response, "Plástico")
            worksheetResumen.getCell('B19').value = parseFloat(sumaPlastico).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A20').value = 'Total no valorizado Metal (Disposicion Final en RS + DF en Relleno Seguridad)';
            const sumaMetal = calcularSumaPesoNoValorizado(response, "Metal")
            worksheetResumen.getCell('B20').value = parseFloat(sumaMetal).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A21').value = 'Total no valorizado Madera (Disposicion Final en RS + DF en Relleno Seguridad)';
            const sumaMadera = calcularSumaPesoNoValorizado(response, "Madera");
            worksheetResumen.getCell('B21').value = parseFloat(sumaMadera).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A22').value = 'Total no valorizado Mezclados (Disposicion Final en RS + DF en Relleno Seguridad)';
            const sumaMezclados = calcularSumaPesoNoValorizado(response, "Mezclados");
            worksheetResumen.getCell('B22').value = parseFloat(sumaMezclados).toFixed(2).replace(",", ".").toString().replace(".", ',');

            worksheetResumen.getCell('A23').value = 'Total preparación para reutilización por todas las subcategoría (Disposicion Final en RS + DF en Relleno Seguridad)';
            const sumaReutilizacion = parseFloat(sumaPapelCarton) + parseFloat(sumaPlastico) + parseFloat(sumaMetal) + parseFloat(sumaMadera) + parseFloat(sumaMezclados);
            worksheetResumen.getCell('B23').value = sumaReutilizacion.toFixed(2).replace(",", ".").toString().replace(".", ',');

            worksheetResumen.getCell('A24').value = 'Total Valorización Región de Arica y Parinacota  (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B24').value = parseFloat(calcularSumaPesoRegion(response, "Región de Arica y Parinacota")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A25').value = 'Total Valorización Región de Tarapacá (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B25').value = parseFloat(calcularSumaPesoRegion(response, "Región de Tarapacá")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A26').value = 'Total Valorización Región de Antofagasta (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B26').value = parseFloat(calcularSumaPesoRegion(response, "Región de Antofagasta")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A27').value = 'Total Valorización Región de Atacama (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B27').value = parseFloat(calcularSumaPesoRegion(response, "Región de Atacama")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A28').value = 'Total Valorización Región de Coquimbo (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B28').value = parseFloat(calcularSumaPesoRegion(response, "Región de Coquimbo")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A29').value = 'Total Valorización Región de Valparaíso (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B29').value = parseFloat(calcularSumaPesoRegion(response, "Región de Valparaíso")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A30').value = 'Total Valorización Región de O’Higgins (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B30').value = parseFloat(calcularSumaPesoRegion(response, "Región de O’Higgins")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A31').value = 'Total Valorización Región del Maule (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B31').value = parseFloat(calcularSumaPesoRegion(response, "Región del Maules")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A32').value = 'Total Valorización Región de Ñuble (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B32').value = parseFloat(calcularSumaPesoRegion(response, "Región de Ñuble")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A33').value = 'Total Valorización Región del Biobío (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B33').value = parseFloat(calcularSumaPesoRegion(response, "Región del Biobío")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A34').value = 'Total Valorización Región de la Araucanía (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B34').value = parseFloat(calcularSumaPesoRegion(response, "Región de la Araucanía")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A35').value = 'Total Valorización Región de Los Ríos (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B35').value = parseFloat(calcularSumaPesoRegion(response, "Región de Los Ríos")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A36').value = 'Total Valorización Región de Los Lagos (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B36').value = parseFloat(calcularSumaPesoRegion(response, "Región de Los Lagos")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A37').value = 'Total Valorización Región de Aysén (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B37').value = parseFloat(calcularSumaPesoRegion(response, "Región de Aysén")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A38').value = 'Total Valorización Región de Magallanes (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B38').value = parseFloat(calcularSumaPesoRegion(response, "Región de Magallanes")).toFixed(2).replace(",", ".").toString().replace(".", ',');
            worksheetResumen.getCell('A39').value = 'Total Valorización Región Metropolitana (Reciclaje Mecánico + Reciclaje Interno + Valorizacion Energetica) ';
            worksheetResumen.getCell('B39').value = parseFloat(calcularSumaPesoRegion(response, "Región Metropolitana")).toFixed(2).replace(",", ".").toString().replace(".", ',');

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