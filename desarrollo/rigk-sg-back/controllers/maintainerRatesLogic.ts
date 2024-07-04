import { Request, Response } from "express";
import maintainerRatesDao from '../dao/maintainerRatesDao';
import ratesDao from "../dao/ratesDao";
class MaintainerRatesLogic {
    async getAllBusiness(req: any, res: Response) {
        try {
            const allRates = await ratesDao.getAllRates;
            res.status(200).json({ status: allRates, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
}
const maintainerRatesLogic = new MaintainerRatesLogic();
export default maintainerRatesLogic;