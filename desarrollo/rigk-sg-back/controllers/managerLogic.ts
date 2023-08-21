import { Request, Response } from "express";
import managerDao from '../dao/managerDao';
import { createLog } from "../helpers/createLog";
import ExcelJS from 'exceljs';
class ManagerLogic {
    async addManager(req: Request|any, res: Response) {
        const type_material = req.body.type_material;
        const region = req.body.region;
        const id_business = req.body.id_business
        try {
            await managerDao.addManager(type_material, region, id_business);
            await createLog('AGREGA_TIPO_MATERIAL', req.uid, null);
            res.status(200).json({ status: true, msg: 'Has creado un gestor', data: {} })
        }
        catch (err:any) {
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
        } catch (err:any) {
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
        const {type_material,region} = req.params;
        try {
            const material = await managerDao.getManagersByMaterial(type_material,region);
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
        // const { id } = req.params;
        try {
            const path = require('path');
            const outputPath = path.join(__dirname, `../../files/templates/_carga_masiva_y.xlsx`);
            /**
             * DATA VALIDATION
             */
            const workbook = new ExcelJS.Workbook();

            // /**
            //  * WORKSHEET DATA
            //  */
            const worksheet = workbook.addWorksheet('Carga Masiva');
            const row = worksheet.getRow(1);
            row.getCell(1).value = "CODIGO ESTABLECIMIENTO";
            row.getCell(2).value = "FECHA DE RETIRO";
            row.getCell(3).value = "NUM GUIA DESPACHO";
            row.getCell(4).value = "TIPO TRATAMIENTO";
            row.getCell(5).value = "TIPO RESIDUO";
            row.getCell(6).value = "TIPO ESPECIFICO";
            row.getCell(7).value = "CÓDIGO LER";
            row.getCell(8).value = "NOMBRE GESTOR";
            row.getCell(9).value = "RUT GESTOR";
            row.getCell(10).value = "CÓDIGO ESTABLECIMIENTO RECEPTOR";
            row.getCell(11).value = "CÓDIGO TRATAMIENTO RECEPTOR";
            row.getCell(12).value = "CANTIDAD (KG)";
            row.commit();

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