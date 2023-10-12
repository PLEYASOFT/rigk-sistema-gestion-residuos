import { Request, Response } from "express";
import dashboardDao from '../dao/dashboardDao';
import { createLog } from "../helpers/createLog";
class DashboardLogic {
    async getDashboard(req: Request | any, res: Response) {
        try {
            const data = await dashboardDao.getDashboard();
            res.status(200).json({ status: true, data })
        }
        catch (err: any) {
            console.log(err);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }

    async getSemesterDashboard(req: Request | any, res: Response) {
        try {
            const data = await dashboardDao.getSemesterDashboard();
            res.status(200).json({ status: true, data })
        }
        catch (err: any) {
            console.log(err);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }

    async getYearlyMaterialWeights(req: Request | any, res: Response) {
        try {
            const data = await dashboardDao.getYearlyMaterialWeights();
            res.status(200).json({ status: true, data })
        }
        catch (err: any) {
            console.log(err);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }

    async getAllTonByYear(req: Request | any, res: Response) {
        const { year } = req.params;
        try {
            const data = await dashboardDao.getAllTonByYear(year);
            res.status(200).json({ status: true, data })
        }
        catch (err: any) {
            console.log(err);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }

    async getCountBusiness(req: Request | any, res: Response) {
        try {
            const data = await dashboardDao.getCountBusiness();
            res.status(200).json({ status: true, data })
        }
        catch (err: any) {
            console.log(err);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }

    async getAllLinearDashboard(req: Request | any, res: Response) {
        const { year } = req.params;
        try {

            console.log(year)
            const data = await dashboardDao.getAllLinearDashboard(year);
            res.status(200).json({ status: true, data })
        }
        catch (err: any) {
            console.log(err);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }

    async getAllBarChartData(req: Request | any, res: Response) {
        const { year } = req.params;
        try {

            console.log(year)
            const data = await dashboardDao.getAllBarChartData(year);
            res.status(200).json({ status: true, data })
        }
        catch (err: any) {
            console.log(err);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }

    async getAllStackedBarChartData(req: Request | any, res: Response) {
        const { year } = req.params;
        try {

            console.log(year)
            const data = await dashboardDao.getAllStackedBarChartData(year);
            res.status(200).json({ status: true, data })
        }
        catch (err: any) {
            console.log(err);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }
}
const dashboardLogic = new DashboardLogic();
export default dashboardLogic;