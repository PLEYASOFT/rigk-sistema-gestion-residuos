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

    async getGoalsYear(req: any, res: Response) {
        const { year } = req.params;
        try {
            const allGoals = await goalsDao.getGoalsYear(year);
            res.status(200).json({ status: true, data: allGoals, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }

    async updateGoals(req: any, res: Response) {
        const data = req.body;
        try {
            const rates = await goalsDao.updateGoals(data);
            if(rates == false) {
                return res.json({ status: false, data: {}, msg: 'No es posible modificar las metas' });
            }
            res.status(200).json({ status: true, data: {}, msg: '' });
        } catch (err:any) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    async saveGoals(req: any, res: Response) {
        const data = req.body;
        try {
            const rates = await goalsDao.saveGoals(data);
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