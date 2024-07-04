import { NextFunction, Request, Response } from "express";
import { statementByIdScheme } from '../../models/statementProductor';
export const verifyParametersStatementByYear = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await statementByIdScheme.validateAsync(req.params);
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, msg: "Formato inválido" });
    }
};