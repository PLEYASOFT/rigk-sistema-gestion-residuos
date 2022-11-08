import { Request, Response } from 'express';
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
}

const statementDeclaretionLogic = new StatementDeclaretionLogic();
export default statementDeclaretionLogic;