import { NextFunction, Request, Response } from "express";
export const verifyParameters = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (id == '') {
        return res.status(400).json({
            status: false,
            message: "parámetros incorrectos"
        });
    }
    next();
};