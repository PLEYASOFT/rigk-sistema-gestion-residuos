import { NextFunction, Request, Response } from "express";
import { loginScheme } from "../models/loginScheme";

export const validateLogin = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.body.user;
    const password = req.body.password;

    try {
        if(user == '' || password == ''){
            res.status(500).json({status:false, msg:'Debe ingresar usuario y contraseña', data: {}});
        }
        else{
            const value = await loginScheme.validateAsync(req.body);
            next();
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({status:false, msg: "Usuario y/o contraseña incorrectos, intenta nuevamente."});
    }
};