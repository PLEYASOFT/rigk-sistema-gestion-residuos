import { NextFunction, Request, Response } from "express";
import { recoveryPasswordScheme } from "../../models/loginScheme";
export const recoveryPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await recoveryPasswordScheme.validateAsync(req.body);
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, msg: "Formato inválido" });
    }
};