import { NextFunction, Request, Response } from "express";

export const veriryemail = (req: Request, res: Response, next: NextFunction) => {
    const {user}=req.body;
    if (!user)
        {res.status(400).json({
            status:false,
            message: 'se requiere email'
        });}
    if (/^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9]).[a-z0-9]{2,10}(?:.[a-z]{2,10})?$/.test(user) === false) {
        res.status(400).json({
            status:false,
            message: 'se requiere email'
        });
        }
        next();
    }  