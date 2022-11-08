import { NextFunction, Request, Response } from "express";
import { statementProductorFormScheme } from '../../models/statementProductor';

export const verifyParametersProductorForm = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const value = await statementProductorFormScheme.validateAsync(req.body);
        console.log(value);
        next();
    } catch (error) {
        return res.status(400).json({status:false, msg: "Formato inválido"});
    }

};