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
        const repeatPassword = req.body.repeatPassword;
        const user = req.uid;
        try {
            if(newPassword !== repeatPassword){
                return res.status(200).json({status:false, msg: 'contraseña no coincide', data: {}})
                
            }
            const output = await authDao.getPassword(user);
            bcrypt.compare(actual, output.PASSWORD).then(async (r) => {
                if(r ){
                    
                    let passwordHash = bcrypt.hashSync(newPassword, 8);
                    const output2 = await authDao.updatePassword(passwordHash, user);
                    res.status(200).json({status:true, msg:'Contraseña cambiada', data: {}})
                }
                else{
                    res.status(200).json({status:false, msg:'Contraseña incorrecta, intenta nuevamente', data: {}});
                }
            });
            
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
                        res.status(200).json({status:true, msg:'', data: {token}})
                    }
                    else{
                        res.status(500).json({status:false, msg:'Usuario y/o contraseña incorrectos, intenta nuevamente', data: {}});
                    }
                });
        }
        catch(err){
            console.log(err)
            res.status(500).json({status:false, msg:'Ocurrió un error', data: {}});
        }
    }

    async sendCode(req: Request, res: Response) {
        const {user} = req.body;
        console.log(user)
        try{
            const output = await authDao.verifyEmail(user);
            if(output.EMAIL=== user)
            {
                const cod = (Math.random() * (999999 -100000) + 100000).toFixed(0);
                await authDao.generateCode(cod, output.ID);
                
                sendCode(output,cod,res);
                res.status(200).json({status:true, msg:'', data: output.EMAIL})
            }

            else{
                res.status(500).json({status:false, msg:'Correo no registrado', data: {}});
            }
        }
        catch(err){
            console.log(err)
            res.status(500).json({status:false, msg:'Ocurrió un error', data: {}});
        }
    }

    async sendCodeVerify(req: Request, res: Response) {
        const code = req.body.code;
        const {user} = req.body;
        try{
            console.log(code, user)
            const output = await authDao.verifyCode(code,user);
            console.log(output)
            if(output.CODE=== code)
            {
                const now = new Date().getTime();
                const dateCode = new Date(output.DATE_CODE).getTime();
                const dif2 = ((now - dateCode)/(60000));

                console.log(dif2);

                if(dif2 <= 5){
                    res.status(200).json({status:true, msg:'Código correcto, modifique contraseña', data: {}})
                }
                else{
                    res.status(500).json({status:false, msg:'Código expirado, solicitelo nuevamente', data: {}});
                }
            }
            else{
                res.status(500).json({status:false, msg:'Código incorrecto', data: {}});
            }
        }
        catch(err){
            console.log(err)
            res.status(500).json({status:false, msg:'Ocurrió un error', data: {}});
        }
    }

    async recoveryPassword(req: Request, res: Response) {
        const user = req.body.user;
        const password = req.body.password;
        const repeatPassword = req.body.repeatPassword;
        try{
            console.log(password, repeatPassword)
            if(password=== repeatPassword){
                let passwordHash = bcrypt.hashSync(password, 8);
                await authDao.recovery(passwordHash, user);
                res.status(200).json({status:true, msg:'Haz recuperado tu contraseña', data: {}})
            }
            else{
                res.status(500).json({status:false, msg:'Contraseñas no coinciden', data: {}});
            }
        }
        catch(err){
            console.log(err)
            res.status(500).json({status:false, msg:'Ocurrió un error', data: {}});
        }
    }
}

const authLogic = new AuthLogic();
export default authLogic;