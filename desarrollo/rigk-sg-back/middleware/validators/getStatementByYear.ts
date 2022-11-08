import { NextFunction, Request, Response } from "express";


export const verifyParametersStatementByYear = ( req: Request, res: Response, next: NextFunction ) => {

    try {
        const { business, year } = req.params;
        if(parseInt(business) && parseInt(year)) {
           return next();
        }
        return res.status(400).json({status:false, msg: "Formato inválido"});
    } catch (error) {
        console.log(error);
        return res.status(400).json({status:false, msg: "Formato inválido"});
    }

};