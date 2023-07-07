import { NextFunction, Request, Response } from "express";
import { modifyPasswordScheme } from "../../models/loginScheme";
export const verifyParametersModifyPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await modifyPasswordScheme.validateAsync(req.body);
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, msg: "Formato inválido" });
    }
};