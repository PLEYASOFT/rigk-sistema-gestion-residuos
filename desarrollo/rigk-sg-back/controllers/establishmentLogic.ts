import { Request, Response } from "express";
import establishmentDao from '../dao/establishmentDao';
class EstablishmentLogic {
    async addEstablishment(req: Request, res: Response) {
        const name = req.body.name;
        const region = req.body.region;
        const id_business = req.body.id_business
        try {
            await establishmentDao.addEstablishment(name, region, id_business);
            res.status(200).json({ status: true, msg: 'Has creado un establecimiento', data: {} })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }
    async getAllEstablishment(req: any, res: Response) {
        try {
            const establishment = await establishmentDao.getAllEstablishment();
            res.status(200).json({ status: establishment, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    async getEstablishment(req: any, res: Response) {
        const id = req.params.id;
        try {
            const establishment = await establishmentDao.getEstablishment(id);
            res.status(200).json({ status: establishment, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    async getEstablishmentByID(req: any, res: Response) {
        const id = req.params.id;
        try {
            const establishment = await establishmentDao.getEstablishmentByID(id);
            res.status(200).json({ status: establishment, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    async deleteEstablishment(req: any, res: Response) {
        const id = req.params.id;
        try {
            const establishment = await establishmentDao.deleteEstablishment(id);
            res.status(200).json({ status: establishment, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    async getDeclarationEstablishment(req: any, res: Response) {
        try {
            const establishment = await establishmentDao.getDeclarationEstablishment(req.uid);
            res.status(200).json({ status: establishment, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    public async saveInvoice(req: any, res: Response) {
        const {vat,invoice_number,id_detail,date_pr,value,valued_total,treatment,id_material} = req.body;
        if (!req.files || Object.keys(req.files).length == 0 || !req.files['file']) {
            return res.status(400).json({ status: false, data: {}, msg: 'Falta archivo' });
        }
        const files = req.files;
        try {
            const data: any = await establishmentDao.saveInvoice(vat,invoice_number,id_detail,date_pr,value, files['file'],valued_total,req.uid,treatment,id_material);
            if(data || data[0] != undefined) {
                return res.status(200).json({ status: true, data: {}, msg: 'Registro guardado satisfactoriamente' });
            } else {
                return res.status(500).json({ status: false, data: {}, msg: 'Algo salió mal' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    public async getInovice(req: any, res: Response) {
        const {invoice_number,vat,treatment_type,material_type} = req.body;
        try {
            const data:any = await establishmentDao.getInvoice(invoice_number,vat,treatment_type,material_type);
            if(data[0]?.NAME){
                res.status(200).json({ status: true, data, msg: '' });
            } else {
                res.status(400).json({ status: false, data, msg: 'Reciclador no encontrado' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
}
const establishmentLogic = new EstablishmentLogic();
export default establishmentLogic;