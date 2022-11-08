import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import mysqlcon from '../db';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generarJWT } from '../helpers/jwt';
import { sendCode } from '../helpers/sendCode';
import authDao from '../dao/authDao';

class AuthLogic {

    async modifyPassword(req:Request, res:Response) 
    {
        const {password ,newPassword, user} = req.body;
        try {
            const output = await authDao.verifyEmail(user);
            if(output.EMAIL == user)
            {
                bcrypt.compare(password, output.PASSWORD).then(async (r) => {
                    if(r){
                        let passwordHash = bcrypt.hashSync(newPassword, 8);
                        const output2 = await authDao.recovery(passwordHash, user);
                        res.json('Contraseña cambiada')
                    }
                    else{
                        res.send('Contraseña incorrecta, intenta nuevamente');                }
                });    
            }
            else{
                res.send("Correo inválido");
            }
        } catch (err) {
            console.log(err)
            res.send({status: 0, message: "Ocurrió un error"});
        }
    }

    async login(req: Request, res: Response) {
        
        const user = req.body.user;
        const password = req.body.password;
        
        try{
            
            const output = await authDao.login(user);
            console.log(password, output.PASSWORD)
            bcrypt.compare(password, output.PASSWORD).then(async (r) => {
                if(r){
                    const token = await generarJWT(output.ID, user);
                    res.json(token);
                }
                else{
                    res.send('Usuario y/o contraseña incorrectos, intenta nuevamente');                }
            });
            
        }
        catch(err){
            console.log(err)
            res.send({status: 0, message: "Ocurrió un error"});
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
            }
            res.send(output);
        }
        catch(err){
            console.log(err)
            res.send({status: 0, message: "Ocurrió un error"});
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
                    res.send("Código correcto, modifique contraseña")
                }
                else{
                    res.send("Código expirado, solicitelo nuevamente")
                }
            }
            else{
                res.send("Código incorrecto");
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

                const output = await authDao.recovery(passwordHash, user);

                res.json("Haz recuperado tu contraseña")
            }

            else{
                res.send("Contraseñas no coinciden");
            }
            
        }
        catch(err){
            console.log(err)
            res.send({status: 0, message: "Ocurrió un error"});
        }
    }
}

const authLogic = new AuthLogic();
export default authLogic;