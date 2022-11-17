import { NextFunction, Request, Response } from "express";
import { modifyPasswordScheme } from "../../models/loginScheme";

export const verifyParametersModifyPassword = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const value = await modifyPasswordScheme.validateAsync(req.body);
        console.log(value);
        next();
    } catch (error) {
        return res.status(400).json({status:false, msg: "Formato inválido"});
    }

};