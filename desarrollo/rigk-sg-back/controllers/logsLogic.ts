import { Response } from "express";
import { createLog } from "../helpers/createLog";
import logsDao from "../dao/logsDao";
import path from "path";
import businessDao from '../dao/businessDao';

class LogsLogic {
    async downloadLogsExcel(req: any, res: Response) {
        const { start, end } = req.body;
        try {
            const tmp = end.split("-");
            const de = `${tmp[0]}-${tmp[1]}-${parseInt(tmp[2])+1}`
            const r: any = await logsDao.getLogs(start, de);
            if (r == undefined) {
                return res.status(400).json({
                    status: false,
                    msg: 'Algo salió mal'
                });
            }
            const excel = require("exceljs");
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Logs");
            worksheet.columns = [
                { header: "ID", key: "id", width: 10 },
                { header: "MARCA DE TIEMPO", key: "name", width: 25 },
                { header: "USUARIO", key: "user", width: 25 },
                { header: "NOMBRE USUARIO", key: "nameU", width: 40 },
                { header: "PERFIL USUARIO", key: "ProfileU", width: 40 },
                { header: "EMPRESAS", key: "business", width: 60 },
                { header: "ACCION", key: "action", width: 40 },
                { header: "RESULTADO", key: "result", width: 10 },
                { header: "DETALLE", key: "detail", width: 50 },
            ];
            for (let i = 0; i < r.length; i++) {
                const log = r[i];
                const row = worksheet.getRow(i + 2);
                const e = await businessDao.getBusinessByUser(log.ID_USER);
                let business = '';
                for (let j = 0; j < e.length; j++) {
                    const b = e[j];
                    business += b.NAME+', ';
                    
                }
                row.getCell(1).value = log.ID;
                row.getCell(2).value = log.CREATED_AT;
                row.getCell(3).value = log.ID_USER;
                row.getCell(4).value = `${log.FIRST_NAME} ${log.LAST_NAME}`;
                row.getCell(5).value = log.USER_PROFILE;
                row.getCell(6).value = business;
                row.getCell(7).value = log.ACTION;
                row.getCell(8).value = log.STATUS;
                row.getCell(9).value = log.ERROR_LOG;
                row.commit();
            }
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + `logs_prorep.xlsx`
            );
            const outputPath = path.join(__dirname, `../../files/templates/logs_${start}.xlsx`);
            await workbook.xlsx.writeFile(outputPath);
            return res.download(outputPath);
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }
    async addExcel(req: any, res: Response) {
        await createLog('DESCARGA_EXCEL_DECLARACIONES_PRODUCTOR', req.uid, null);
        res.json({ status: true });
    }
    async errorExcel(req: any, res: Response) {
        const {error} = req.body;
        await createLog('DESCARGA_EXCEL_DECLARACIONES_PRODUCTOR', req.uid, error);
        res.json({ status: true });
    }
}
const logsLogic = new LogsLogic();
export default logsLogic;