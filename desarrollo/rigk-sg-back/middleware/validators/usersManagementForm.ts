import { Request, Response, NextFunction } from "express";
import { userScheme } from '../../models/userScheme';


export const validaRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userScheme.validateAsync(req.body);
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, msg: "Formato inválido" });
    }
}