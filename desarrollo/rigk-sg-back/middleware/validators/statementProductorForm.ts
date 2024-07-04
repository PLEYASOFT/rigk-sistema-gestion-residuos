import { NextFunction, Request, Response } from "express";
import { statementProductorFormScheme } from '../../models/statementProductor';
export const verifyParametersProductorForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await statementProductorFormScheme.validateAsync(req.body);
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, msg: "Formato inválido" });
    }
};