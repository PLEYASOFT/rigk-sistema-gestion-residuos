import path from "path";
import { Request, Response } from 'express';
import utilesDao from "../dao/utilesDao";

class utilesLogic {
    async downloadPdf(req: any, res: Response) {
        const outputPath = path.join(__dirname, '../../files/templates/DJ PROREP - Plataforma.pdf');
        return res.download(outputPath);
    }

    public async saveFile(req: any, res: Response) {
        const fileBuffer = req.files.file.data;
        try {
            const resp: any = await utilesDao.postFilePDF(fileBuffer, req.uid);
            if (resp === undefined) {
                return resp.status(400).json({ status: false, message: "Algo salió mal" });


            }
            res.status(201).json({ status: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    public async verifyUser(req: any, res: Response) {
        try {
            const r: any = await utilesDao.verifyUser(req.uid);
            console.log(r);
            if (r == false) return res.status(200).json({ status: false, msg: 'undefined o null', data: {} });
            res.status(200).json({ status: true, msg: '', data: {}});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }
    public async download(req: any, res: Response) {
        try {
            const r: any = await utilesDao.findFile(req.uid);
            console.log("...",r);
            if (r == false ) return res.status(200).json({ status: false, msg: 'undefined o null', data: {} });
            const fileContent = Buffer.from(r, 'binary');

            res.setHeader('Content-Type', "application/pdf");
            res.setHeader('Content-Disposition', `attachment; filename=Declaracion.pdf`);
            res.send(fileContent);
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }

}
export default new utilesLogic();