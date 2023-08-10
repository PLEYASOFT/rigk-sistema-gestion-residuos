import { Request, Response } from "express";
import ratesDao from "../dao/ratesDao";
class RatesLogic {
    async getRatesByYear(req: any, res: Response) {
        const { year } = req.params;
        try {
            const resp = await ratesDao.ratesID(year);
            res.status(200).json({ status: true, data: resp, msg: 'ok' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    public async getRatesCLP(req: Request, res: Response) {
        const now = new Date();
        const date = now.toISOString().split("T")[0];
        const year = (now.getFullYear()).toString();
        try {
            const uf = await ratesDao.getUF(date);
            const rates_resp = await ratesDao.ratesID(year);
            const resp: any[] = [];
            for (let i = 0; i < rates_resp.length; i++) {
                const rate = rates_resp[i];
                rate.clp = (rate.price * uf).toFixed(0);
                resp.push(rate);
            }
            res.json({ status: true, data: resp });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    public async getUfDay(req: Request, res: Response) {
        const now = new Date();
        const date = now.toISOString().split("T")[0];
        try {
            const uf = await ratesDao.getUF(date);
            res.json({ status: true, data: uf });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }

    }

    public async getUfDate(req: Request, res: Response) {
        const {date} = req.params;

        try {
            const uf = await ratesDao.getUF(date);
            res.json({ status: true, data: uf });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }

    }
    async getAllRates(req: any, res: Response) {
        try {
            const allRates = await ratesDao.getAllRates();
            res.status(200).json({ status: true, data: allRates, msg: '' });
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
            const rates = await ratesDao.updateRatesByYear(data);
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
            const rates = await ratesDao.saveRate(data);
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
const ratesLogic = new RatesLogic();
export default ratesLogic;