

import { NextFunction, Request, Response } from "express";


export const verifyParametersUpdateStateForm = ( req: Request, res: Response, next: NextFunction ) => {

    try {
        const { id, state } = req.params;
        if(parseInt(id) && Boolean(state)) {
           return next();
        }
        return res.status(400).json({status:false, msg: "Formato inválido"});
    } catch (error) {
        console.log(error);
        return res.status(400).json({status:false, msg: "Formato inválido"});
    }

};