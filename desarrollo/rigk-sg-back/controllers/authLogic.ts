import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import mysqlcon from '../db';
import jwt from 'jsonwebtoken';
import { generarJWT } from '../helpers/jwt';
import { sendCode } from '../helpers/sendCode';
import authDao from '../dao/authDao';
import { resolve } from 'path';

class AuthLogic {

    async modifyPassword(req:any, res:Response) 
    {
        const {newPassword, actual} = req.body;
        const user = req.uid;

        try {
            const output = await authDao.getPassword(user);
            bcrypt.compare(actual, output.PASSWORD).then(async (r) => {
                if(r){
                    let passwordHash = bcrypt.hashSync(newPassword, 8);
                    const output2 = await authDao.updatePassword(passwordHash, user);
                    res.status(200).json({status:true, msg:'Contraseña cambiada', data: {}})
                }
                else{
                    res.status(500).json({status:false, msg:'Contraseña incorrecta, intenta nuevamente', data: {}});
                }
            });
            // }
            // else{
            //     res.status(500).json({status:false, msg:'Correo inválido', data: {}});
            // }
        } catch (err) {
            res.status(500).json({status:false, msg:'Ocurrió un error', data: {}});
        }
    }

    async login(req: Request, res: Response) {
        const user = req.body.user;
        const password = req.body.password;
        try{
            const output = await authDao.login(user);
            bcrypt.compare(password, output.PASSWORD).then(async (r) => {
                if(r){
                    const token = await generarJWT(output.ID, user, output.ROL);
                    res.json({status:true, data:token});
                }
                else{
                    res.json('Usuario y/o contraseña incorrectos, intenta nuevamente');                
                }
            });
        }
        catch(err){
            console.log(err)
            res.json({status: 0, message: "Ocurrió un error"});
        }
    }

    async sendCode(req: Request, res: Response) {
        const {user} = req.body;
        console.log(user)
        try{
            const output = await authDao.verifyEmail(user);
            if(output.EMAIL == user)
            {
                const cod = (Math.random() * (999999 -100000) + 100000).toFixed(0);
                await authDao.generateCode(cod, output.ID);
                
                sendCode(output,cod,res);
                
                res.json(output.EMAIL);
            }
        }
        catch(err){
            console.log(err)
            res.json({status: 0, message: "Ocurrió un error"});
        }
    }

    async sendCodeVerify(req: Request, res: Response) {
        const code = req.body.code;
        const {user} = req.body;
        try{

            const output = await authDao.verifyCode(code,user);
            if(output.CODE == code)
            {
                const now = new Date().getTime();
                const dateCode = new Date(output.DATE_CODE).getTime();

                const dif2 = ((now - dateCode)/(60000));

                console.log(dif2);

                if(dif2 <= 5){
                    res.json("Código correcto, modifique contraseña")
                }
                else{
                    res.json("Código expirado, solicitelo nuevamente")
                }
            }
            else{
                res.json("Código incorrecto");
            }
        }
        catch(err){
            console.log(err)
            res.send({status: 0, message: "Ocurrió un error"});
        }
    }

    async recoveryPassword(req: Request, res: Response) {
        const user = req.body.user;
        const password = req.body.password;
        const repeatPassword = req.body.repeatPassword;
        try{
            if(password == repeatPassword){
                let passwordHash = bcrypt.hashSync(password, 8);

                await authDao.recovery(passwordHash, user);

                res.json("Haz recuperado tu contraseña")
            }
            else{
                res.json("Contraseñas no coinciden");
            }
        }
        catch(err){
            console.log(err)
            res.json({status: 0, message: "Ocurrió un error"});
        }
    }
}

const authLogic = new AuthLogic();
export default authLogic;