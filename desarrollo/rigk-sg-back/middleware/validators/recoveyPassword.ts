import { NextFunction, Request, Response } from "express";
import { modifyPasswordScheme, recoveryPasswordScheme } from "../../models/loginScheme";

export const recoveryPassword = async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const password = req.body.password;

    try {
        const value = await recoveryPasswordScheme.validateAsync(req.body);
        console.log(value);
        next();
    } catch (error) {
        return res.status(400).json({status:false, msg: "Formato inválido"});
    }

};