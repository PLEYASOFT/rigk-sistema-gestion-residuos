import { Request, Response } from 'express';
import loginDao from '../dao/loginDao';
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
    public async saveForm(req: Request, res: Response) {
        
        try {
            const {header, detail} = req.body;
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