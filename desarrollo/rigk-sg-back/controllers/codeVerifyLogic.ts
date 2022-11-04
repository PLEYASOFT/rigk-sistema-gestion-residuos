import { Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

import codeVerifyDao from '../dao/codeVerifyDao';

class CodeVerifyLogic {

    async sendCode(req: Request, res: Response) {

        const code = req.body.code;
        const id = req.body.id;

        try{

            const output = await codeVerifyDao.verifyCode(code);
            if(output.CODE == code)
            {
                //Significa que el código es correcto y puede cambiar contraseña
                res.send(output);
                return true;
            }
            else{
                res.send(output);
                return false;
            }
            
        }
        catch(err){
            console.log(err)
            res.send({status: 0, message: "Ocurrió un error"});
        }
    }
}

const codeVerifyLogic = new CodeVerifyLogic();
export default codeVerifyLogic;