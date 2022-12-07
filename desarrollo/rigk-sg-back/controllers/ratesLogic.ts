import { Request, Response } from "express";
import ratesDao from "../dao/ratesDao";

class RatesLogic {
    
    async getRatesByYear(req: any, res: Response) {
        const {year} = req.params;
        try {
            const resp = await ratesDao.ratesID(year);
            res.status(200).json({status: true, data:resp, msg: 'ok'});
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
}

const ratesLogic = new RatesLogic();
export default ratesLogic;