import { Request, Response } from 'express';
import loginDao from '../dao/loginDao';
import statementDao from '../dao/statementDeclaretionDao';


class StatementDeclaretionLogic {

    async previous(req: Request, res: Response) {
        const {year, business} = req.params;
        const statement = await statementDao.getDeclaretionByYear(business,year);
        res.status(200).json({
            status: true,
            data: statement
        });
    }
    async saveForm(req: Request, res: Response) {
        const {header, business} = req.body;

        

    }
}

const statementDeclaretionLogic = new StatementDeclaretionLogic();
export default statementDeclaretionLogic;