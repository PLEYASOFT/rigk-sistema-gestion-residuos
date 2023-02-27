import { Request, Response } from "express";
import industrialConsumerDao from "../dao/industrialConsumerDao";
class IndustrialConsumer {
    public async saveForm(req: any, res: Response) {
        const header = JSON.parse(req.body.header);
        const detail = JSON.parse(req.body.detail);
        const files = req.files;
        try {
            header.created_by = req['uid'];
            const id_header = await industrialConsumerDao.saveForm(header, detail, files);
            res.json({ status: true, data: id_header });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    public async getForm(req: any, res: Response) {
        const { id } = req.params;
        try {
            const data = await industrialConsumerDao.getForm(id);
            res.json({ status: true, data });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    public async verify(req: any, res: Response) {
        const { year, business } = req.params;
        try {
            const data = await industrialConsumerDao.verify(year, business);
            res.status(200).json({ status: data });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
}
const industrialConsumer = new IndustrialConsumer();
export default industrialConsumer;