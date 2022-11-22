import { NextFunction, Request, Response } from "express";
import { recoveryPasswordScheme } from "../../models/loginScheme";

export const recoveryPassword = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const value = await recoveryPasswordScheme.validateAsync(req.body);
        console.log(value);
        next();
    } catch (error) {
        return res.status(400).json({status:false, msg: "Formato inválido"});
    }

};