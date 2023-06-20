import path from "path";
import { Request, Response } from 'express';
import utilesDao from "../dao/utilesDao";

class utilesLogic {
    async downloadPdf(req: any, res: Response) {
    const outputPath = path.join(__dirname, '../../files/templates/1462023 125625.pdf');
    return res.download(outputPath);        
    }
    async uploadPdf(req: any, res: Response) {
        const outputPath = path.join(__dirname, '../../files/templates/pdf.pdf');
        return req.sendFile(outputPath);        
        }
    async post(req: any, res: Response) {
        const { pdf } = req.body;
        try {
            const filePdf = await utilesDao.postFilePDF(pdf);
            res.status(200).json({ status: filePdf, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
}
export default new utilesLogic();