import { Request, Response } from "express";
import businessDao from '../dao/businessDao';
import { createLog } from "../helpers/createLog";
class BusinessLogic {
    async verifyId(req: any, res: Response) {
        const { id } = req.params;
        const user = req.uid;
        try {
            const { resp, id2 } = await businessDao.checkID(user, id);
            res.status(200).json({ status: resp, data: id2, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    async getBusiness(req: any, res: Response) {
        const { id } = req.params;
        try {
            const business = await businessDao.getBusiness(id);
            res.status(200).json({ status: business, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    async getBusinessByUser(req: any, res: Response) {
        const { uid } = req;
        try {
            const business = await businessDao.getBusinessByUser(uid);
            res.status(200).json({ status: true, data: business, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    async getAllBusiness(req: any, res: Response) {
        try {
            const business = await businessDao.getAllBusiness();
            res.status(200).json({ status: business, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    async getBusinessByVAT(req: any, res: Response) {
        const {vat} = req.params;
        try {
            const business = await businessDao.getBusinessByVAT(vat);
            res.status(200).json({ status: business, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    async checkEstablishmentBusinessRelation(req: any, res: Response) {
        const {establishmentId, businessId,specificType} = req.params;
        try {
            const business = await businessDao.checkEstablishmentBusinessRelation(establishmentId, businessId,specificType);
            res.status(200).json({ status: business, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    async postBusiness(req: any, res: Response) {
        const { name, vat, loc_address, email, phone, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone, code_business, giro } = req.body;
        try {
            const business = await businessDao.postBusiness(name, vat, loc_address, phone, email, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone, code_business, giro);
            await createLog('AGREGA_EMPRESA', req.uid, null);
            res.status(200).json({ status: business, data: {}, msg: '' });
        } catch (err:any) {
            console.log(err);
            await createLog('AGREGA_EMPRESA', req.uid, err.message);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    async deleteBusiness(req: any, res: Response) {
        const id = req.params.id;
        try {
            const business = await businessDao.deleteBusiness(id);
            await createLog('ELIMINA_EMPRESA', req.uid, null);
            res.status(200).json({ status: business, data: {}, msg: '' });
        } catch (err:any) {
            console.log(err);
            await createLog('ELIMINA_EMPRESA', req.uid, err.message);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    async updateBusiness(req: any, res: Response) {
        const { name, vat, loc_address, email, phone, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone, code_business, giro } = req.body;
        const { id } = req.params;
        try {
            const business = await businessDao.updateBusiness(id, name, vat, loc_address, phone, email, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone, code_business, giro);
            await createLog('MODIFICA_EMPRESA', req.uid, null);
            res.status(200).json({ status: business, data: {}, msg: '' });
        } catch (err:any) {
            console.log(err);
            await createLog('MODIFICA_EMPRESA', req.uid, err.message);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    async getAllBusinessById(req: any, res: Response) {
        const { id, year } = req.params;
        try {
            const data = await businessDao.getAllBusinessById(id, year);
            res.status(200).json({ status: true, data, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }

    async businessByCode(req: any, res: Response) {
        const { code } = req.params;
        try {
            const data = await businessDao.businessByCode(code);
            res.status(200).json({ status: true, data, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }

    async getBusinessByUserId(req: any, res: Response) {
        const { id } = req.params;
        try {
            const data = await businessDao.getBusinessByUserId(id);
            res.status(200).json({ status: true, data, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }

    async getCodeBusiness(req: any, res: Response) {
        const { idBusiness } = req.params;
        try {
            const data = await businessDao.getCodeBusiness(idBusiness);
            res.status(200).json({ status: true, data, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
}
const businessLogic = new BusinessLogic();
export default businessLogic;