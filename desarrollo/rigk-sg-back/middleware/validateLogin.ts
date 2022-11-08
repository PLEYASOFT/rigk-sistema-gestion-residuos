import { NextFunction, Request, Response } from "express";
import loginScheme from "../models/loginScheme";

export const validateLogin = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const value = await loginScheme.validateAsync(req.body);
        console.log(value);
        next();
    } catch (error) {
        return res.status(400).json({status:false, msg: "Formato inválido"});
    }
    
    

};