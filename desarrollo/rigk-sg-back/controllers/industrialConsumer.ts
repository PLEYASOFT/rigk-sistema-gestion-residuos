import { Request, Response } from "express";
import industrialConsumerDao from "../dao/industrialConsumerDao";
import establishmentDao from '../dao/establishmentDao';
import ExcelJS from 'exceljs';
class IndustrialConsumer {
    public async saveForm(req: any, res: Response) {
        const header = JSON.parse(req.body.header);
        const detail = JSON.parse(req.body.detail);
        const files = req.files;
        try {
            header.created_by = req['uid'];
            const id_header = await industrialConsumerDao.saveForm(header, detail, files);
            res.json({ status: true, data: id_header });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    public async verifyRow(req: any, res: Response) {
        const {treatment, sub,gestor,date} = req.body;
        try {
            const data: any = await industrialConsumerDao.verifyRow(treatment, sub,gestor,date);
            if(data.length > 0) {
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
            const id_header = await industrialConsumerDao.saveFile(idDetail, fileName, fileBuffer, typeFile);
            res.json({ status: true, data: id_header });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
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
            const id_header = await industrialConsumerDao.deleteById(id);
            res.json({ status: true, data: id_header });
        } catch (error) {
            console.log(error);
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

            /**
             * DATA VALIDATION
             */
            const workbook = new ExcelJS.Workbook();
            const worksheetInfo = workbook.addWorksheet('Info');
            const rowInfo = worksheetInfo.getRow(1);
            rowInfo.getCell(1).value = "CODIGO";

            for (let i = 0; i < establishments.length; i++) {
                const establishment = establishments[i];
                const rowInfo = worksheetInfo.getRow(i + 2);
                rowInfo.getCell(1).value = `${establishment.ID_ESTABLISHMENT} - ${establishment.REGION} - ${establishment.NAME_ESTABLISHMENT}`;
            }
            rowInfo.commit();
            worksheetInfo.getRow(1).getCell(2).value = "TIPO TRATAMIENTO";
            worksheetInfo.getRow(2).getCell(2).value = "Reciclaje Mecánico";
            worksheetInfo.getRow(3).getCell(2).value = "Valorización Energética";
            worksheetInfo.getRow(4).getCell(2).value = "Disposición Final en RS";

            worksheetInfo.addTable({
                name: 'Residuos',
                ref: 'C1',
                headerRow: true,
                columns: [
                    { name: 'Residuos', filterButton: false },
                ],
                rows: [
                    ['PapelCartón'],
                    ['Metal'],
                    ['Plástico'],
                    ['Madera']
                ],
            });
            worksheetInfo.addTable({
                name: 'PapelCartón',
                ref: 'D1',
                headerRow: true,
                columns: [
                    { name: 'PapelCarton', filterButton: false },
                ],
                rows: [
                    ['Cartón: cajas'],
                    ['Cartón: esquineros, conos'],
                    ['Papel: bolsas, papel kraft, manuales'],
                    ['Papel compuesto: bolsas de cemento, linear']
                ],
            });
            worksheetInfo.addTable({
                name: 'Metal',
                ref: 'E1',
                headerRow: true,
                columns: [
                    { name: 'Metal', filterButton: false },
                ],
                rows: [
                    ['Aluminio: latas, rejas IBC'],
                    ['Fierro: hojalata, tambores, zunchos, tinetas, tanques'],
                ],
            });
            worksheetInfo.addTable({
                name: 'Plástico',
                ref: 'F1',
                headerRow: true,
                columns: [
                    { name: 'Plástico', filterButton: false },
                ],
                rows: [
                    ['Rígido: bidones, tambores, botellas, IBC, tinetas'],
                    ['Rígido: pallets, bins'],
                    ['Flexibles rafia: sacos, maxisacos'],
                    ['Flexibles láminas: films de embalaje, bolsas, burbujas, contraible, flexitank'],
                    ['Flexibles: zunchos'],
                    ['Poliestireno: cajas, protecciones, bandejas'],
                    ['Plásticos compuestos: multicapas']
                ],
            });
            worksheetInfo.addTable({
                name: 'Madera',
                ref: 'G1',
                headerRow: true,
                columns: [
                    { name: 'Madera', filterButton: false },
                ],
                rows: [
                    ['Pallet'],
                    ['Cajas, esquineros, carretes'],
                ],
            });

            const rowInfoTT = worksheetInfo.getRow(1);
            rowInfoTT.getCell(1).value = "TIPO TRATAMIENTO";

            const colInfo = worksheetInfo.columns;
            colInfo[0].width = 9;
            colInfo[1].width = 25;
            colInfo[2].width = 25;
            worksheetInfo.state = 'veryHidden';

            /**
             * WORKSHEET DATA
             */
            const worksheet = workbook.addWorksheet('Carga Masiva');
            const row = worksheet.getRow(1);
            row.getCell(1).value = "CODIGO ESTABLECIMIENTO";
            row.getCell(2).value = "FECHA DE RETIRO";
            row.getCell(3).value = "NUM GUIA DESPACHO";
            row.getCell(4).value = "TIPO TRATAMIENTO";
            row.getCell(5).value = "TIPO RESIDUO";
            row.getCell(6).value = "TIPO ESPECIFICO";
            row.getCell(7).value = "NOMBRE GESTOR";
            row.getCell(8).value = "CÓDIGO LER";
            row.getCell(9).value = "RUT ESTABLECIMIENTO RECEPTOR";
            row.getCell(10).value = "CÓDIGO ESTABLECIMIENTO RECEPTOR";
            row.getCell(11).value = "CÓDIGO TRATAMIENTO RECEPTOR";
            row.getCell(12).value = "CANTIDAD (KG)";
            row.commit();

            const col = worksheet.columns;
            col[0].width = 24.17;
            col[1].width = 10;
            col[2].width = 14.83;
            col[3].width = 14.83;
            col[4].width = 14.83;
            col[5].width = 14.83;
            col[6].width = 14.83;
            col[7].width = 14.83;
            col[8].width = 26;
            col[9].width = 26;
            col[10].width = 26;
            col[11].width = 9;

            const maxRows = 50;
            for (let i = 1; i <= maxRows; i++) {
                worksheet.getCell(`A${i + 1}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    showErrorMessage: true,
                    error: 'aaaa',
                    formulae: [`Info!$A$2:$A$${establishments.length + 1}`]
                };
                worksheet.getCell(`B${i + 1}`).dataValidation = {
                    type: 'date',
                    allowBlank: false,
                    operator: 'lessThanOrEqual',
                    showErrorMessage: true,
                    errorStyle: 'error',
                    errorTitle: 'Fecha Inválida',
                    error: 'No debe superar la fecha de hoy',
                    formulae: [new Date()]
                };
                worksheet.getCell(`D${i + 1}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    formulae: [`Info!$B$2:$B$4`]
                };

                worksheet.getCell(`E${i + 1}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    formulae: [`Info!$C$2:$C$5`],
                };
                worksheet.getCell(`F${i + 1}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    formulae: [`=INDIRECT(E${i + 1})`],
                };
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