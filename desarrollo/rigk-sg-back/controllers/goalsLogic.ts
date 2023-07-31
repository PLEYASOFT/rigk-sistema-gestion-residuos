import { Request, Response } from "express";
import goalsDao from "../dao/goalsDao";
import ratesDao from "../dao/ratesDao";
class GoalsLogic {
    async getAllGoals(req: any, res: Response) {
        try {
            const allGoals = await goalsDao.getAllGoals();
            res.status(200).json({ status: true, data: allGoals, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }

    async updateRates(req: any, res: Response) {
        const data = req.body;
        try {
            const rates = await goalsDao.updateRatesByYear(data);
            if(rates == false) {
                return res.json({ status: false, data: {}, msg: 'No es posible modificar las tarifas porque existen declaraciones pendientes y/o enviadas en el año' });
            }
            // await createLog('MODIFICA_EMPRESA', req.uid, null);
            res.status(200).json({ status: true, data: {}, msg: '' });
        } catch (err:any) {
            console.log(err);
            // await createLog('MODIFICA_EMPRESA', req.uid, err.message);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    async saveRates(req: any, res: Response) {
        const data = req.body;
        try {
            const rates = await goalsDao.saveRate(data);
            if(rates == false) {
                return res.json({ status: false, data: {}, msg: 'Año ya existe' });
            }
            // await createLog('MODIFICA_EMPRESA', req.uid, null);
            res.status(200).json({ status: true, data: {}, msg: '' });
        } catch (err:any) {
            console.log(err);
            // await createLog('MODIFICA_EMPRESA', req.uid, err.message);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }

}
const goalsLogic = new GoalsLogic();
export default goalsLogic;