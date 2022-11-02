import { NextFunction, Request, Response } from "express";


export const verifyParameters = (req: Request, res: Response, next: NextFunction) => {
    const {id, user} = req.params;
    if(parseInt(id) == NaN || parseInt(user) == NaN ) {
        return res.status(400).json({
            status: false,
            message: "parámetros incorrectos"
        });
    }
    next();
};