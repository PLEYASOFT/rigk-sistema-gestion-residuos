import { NextFunction, Request, Response } from "express";
import { updateStateScheme } from '../../models/statementProductor';
export const verifyParametersUpdateStateForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await updateStateScheme.validateAsync(req.params);
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, msg: "Formato inválido" });
    }
};