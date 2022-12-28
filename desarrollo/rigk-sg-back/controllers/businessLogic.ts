import { Request, Response } from "express";
import businessDao from '../dao/businessDao';


class BusinessLogic {
    async verifyId(req: any, res: Response) {
        const {id} = req.params;
        const user = req.uid; 
        try {
            const resp = await businessDao.checkID(user,id);
            res.status(200).json({status: resp, data:{}, msg: ''});
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }

    async getBusiness(req: any, res: Response) {
        const {id} = req.params;

        try {
            const business = await businessDao.getBusiness(id);
            res.status(200).json({status: business, data:{}, msg: ''});
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
            console.log(business)
            res.status(200).json({status: business, data:{}, msg: ''});
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