import { Request, Response } from 'express';
import statementDao from '../dao/statementProductorDao';

class StatementProductorLogic {
    public async getStatmentByYear(req: Request, res: Response) {
        const {year, business} = req.params;
        try {
            const statement = await statementDao.getDeclaretionByYear(business,year);
            res.status(200).json({
                status: true,
                data: statement
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,
                msg: "Algo salió mal"
            });
        }
    }
    public async saveForm(req: any, res: Response) {
        try {
            const {header, detail} = req.body;
            header.created_by = req['uid'];
            const {id_header} = await statementDao.saveDeclaretion(header,detail);
            res.status(200).json({
                status: true,
                data: id_header
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,
                msg: "Algo salió mal"
            });
        }
    }
    public async updateStateForm(req: Request, res: Response) {
        const {id, state} = req.params;
        try {
            await statementDao.changeStateHeader(Boolean(state),parseInt(id));
            res.status(200).json({status:true});
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,
                msg: "Algo salió mal"
            });
        }
    }
    public async updateValuesForm(req: Request, res: Response) {
        const {id} = req.params;
        const {detail} = req.body;
        try {
            await statementDao.updateValueStatement(id,detail);
            res.status(200).json({status:true});
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,
                msg: "Algo salió mal"
            });
        }
    }
}

const statementProductorLogic = new StatementProductorLogic();
export default statementProductorLogic;