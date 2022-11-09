import { NextFunction, Request, Response } from "express";
import { updateStateScheme } from '../../models/statementProductor';

export const verifyParametersUpdateStateForm = async ( req: Request, res: Response, next: NextFunction ) => {

    try {
        
        const value = await updateStateScheme.validateAsync(req.params);
        console.log(value);
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({status:false, msg: "Formato inválido"});
    }

};