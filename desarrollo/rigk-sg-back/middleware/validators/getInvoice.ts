import { NextFunction, Request, Response } from "express";
import { getScheme, saveScheme } from "../../models/invoiceScheme";
export const verifyParametersGetInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await getScheme.validateAsync(req.body);
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, msg: "Formato inválido" });
    }
};
export const verifyParametersSaveInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await saveScheme.validateAsync(req.body);
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, msg: "Formato inválido" });
    }
};