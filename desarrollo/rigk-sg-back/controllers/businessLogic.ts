import { Request, Response } from "express";
import businessDao from '../dao/businessDao';


class BusinessLogic {
    async verifyId(req: any, res: Response) {
        const { id } = req.params;
        const user = req.uid;
        try {
            const resp = await businessDao.checkID(user, id);
            res.status(200).json({ status: resp, data: {}, msg: '' });
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

    async postBusiness(req: any, res: Response) {

        const { name, vat, loc_address, email, phone, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone, code_business, giro } = req.body;

        try {
            const business = await businessDao.postBusiness(name, vat, loc_address, phone, email, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone, code_business,giro);
            res.status(200).json({ status: business, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
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
            res.status(200).json({ status: business, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }

    async updateBusiness(req: any, res: Response) {
        const { name, vat, loc_address, email, phone, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone, code_business,giro } = req.body;
        const { id } = req.params;
        try {
            const business = await businessDao.updateBusiness(id, name, vat, loc_address, phone, email, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone, code_business,giro);
            res.status(200).json({ status: business, data: {}, msg: '' });
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