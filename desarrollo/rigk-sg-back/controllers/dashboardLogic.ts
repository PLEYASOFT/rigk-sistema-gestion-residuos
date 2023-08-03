import { Request, Response } from "express";
import dashboardDao from '../dao/dashboardDao';
import { createLog } from "../helpers/createLog";
class DashboardLogic {
    async getDashboard(req: Request|any, res: Response) {
        try {
            const data = await dashboardDao.getDashboard();
            res.status(200).json({ status: true, data })
        }
        catch (err:any) {
            console.log(err);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }
}
const dashboardLogic = new DashboardLogic();
export default dashboardLogic;