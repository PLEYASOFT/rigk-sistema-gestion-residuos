import { Request, Response } from "express";
import managerDao from '../dao/managerDao';
class ManagerLogic {
    async addManager(req: Request, res: Response) {
        const type_material = req.body.type_material;
        const region = req.body.region;
        const id_business = req.body.id_business
        try {
            await managerDao.addManager(type_material, region, id_business);
            res.status(200).json({ status: true, msg: 'Has creado un gestor', data: {} })
        }
        catch (err) {
            console.log(err)
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
            res.status(200).json({ status: manager, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
}
const managerLogic = new ManagerLogic();
export default managerLogic;