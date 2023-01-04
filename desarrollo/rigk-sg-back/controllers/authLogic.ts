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
            else if (newPassword == '' || repeatPassword == ''){
                return res.status(200).json({status:false, msg: 'ingrese una contraseña', data: {}})
            }
            else{
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
            }
        } catch (err) {
            res.status(500).json({status:false, msg:'Ocurrió un error', data: {}});
        }
    }
    async login(req: Request, res: Response) {
        const user = req.body.user;
        const password = req.body.password;
        
        try{
            const output = await authDao.login(user);
            if(output != undefined){
                bcrypt.compare(password, output.PASSWORD).then(async (r) => {
                    if(r){
                        const token = await generarJWT(output.ID, user, output.ROL);
                        delete output.PASSWORD;
                        delete output.SALT;
                        delete output.STATE
                        delete output.DATE_CODE;
                        delete output.CODE
                        delete output.ID;
                        res.header('x-token',token!.toString());
                        res.header("Access-Control-Expose-Headers", "*");
                        res.status(200).json({status:true, msg:'', data: {user:output}})
                    }
                    else{
                        res.status(200).json({status:false, msg:'Usuario y/o contraseña incorrectos, intenta nuevamente', data: {}});
                    }
                });
            }
            else{
                res.status(200).json({status:false, msg:'Usuario y/o contraseña incorrectos, intenta nuevamente', data: {}});
            }
        }
        catch(err){
            console.log(err)
            res.status(500).json({status:false, msg:'Ocurrió un error', data: {}});
        }
    }
    async sendCode(req: Request, res: Response) {
        const {user} = req.body;
        try{
            const output = await authDao.verifyEmail(user);
            if(output.EMAIL== user)
            {
                const cod = (Math.random() * (999999 -100000) + 100000).toFixed(0);
                await authDao.generateCode(cod, output.ID);
                
                sendCode(output,cod,res);
                res.status(200).json({status:true, msg:'', data: output.EMAIL})
            }

            else{
                res.status(200).json({status:false, msg:'Correo no registrado', data: {}});
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
            const output = await authDao.verifyCode(code,user);
            if(output.CODE== code)
            {
                const now = new Date().getTime();
                const dateCode = new Date(output.DATE_CODE).getTime();
                const dif2 = ((now - dateCode)/(60000));
                if(dif2 <= 5){
                    res.status(200).json({status:true, msg:'Código correcto, modifique contraseña', data: {}})
                }
                else{
                    res.status(200).json({status:false, msg:'Código expirado, solicitelo nuevamente', data: {}});
                }
            }
            else{
                res.status(200).json({status:false, msg:'Código incorrecto', data: {}});
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
            if(password !== repeatPassword){
                return res.status(200).json({status:false, msg: 'contraseña no coincide', data: {}})
            }
            else if(password == '' || repeatPassword == ''){
                res.status(200).json({status:false, msg:'Contraseña vacía', data: {}});
            }
            else{
                let passwordHash = bcrypt.hashSync(password, 8);
                await authDao.recovery(passwordHash, user);
                res.status(200).json({status:true, msg:'Haz recuperado tu contraseña', data: {}})
            }
        }
        catch(err){
            console.log(err)
            res.status(500).json({status:false, msg:'Ocurrió un error', data: {}});
        }
    }

    async register(req: Request, res: Response) {
        const user = req.body.user;
        const first_name = req.body.first_name;
        const last_name = req.body.last_name
        const password = req.body.password;
        const phone = req.body.phone;
        const phone_office = req.body.phone_office;
        const position = req.body.position;
        try{   
            let passwordHash = bcrypt.hashSync(password, 8);
            const result = await authDao.register(user,first_name,last_name,passwordHash, phone,phone_office, position);
            res.status(200).json({status:true, msg:'Has creado usuario', data: {}})
            }
        catch(err){
            console.log(err)
            res.status(500).json({status:false, msg:'Ocurrió un error', data: {}});
        }
    }
}

const authLogic = new AuthLogic();
export default authLogic;