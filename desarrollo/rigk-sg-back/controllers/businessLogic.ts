import { Request, Response } from "express";
import businessDao from '../dao/businessDao';


class BusinessLogic {
    async verifyId(req: Request, res: Response) {
        const {id, user} = req.params;
        try {
            const resp = await businessDao.checkID(user,id);
            res.status(200).json(resp);
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