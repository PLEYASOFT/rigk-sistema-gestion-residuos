import { Request, Response } from 'express';


import recoveryDao from '../dao/recoveryDao';
import { sendCode } from '../helpers/sendCode';
import bcrypt from 'bcrypt';

class RecoveryLogic {

    async sendCode(req: Request, res: Response) {

        const {user} = req.body;

        console.log(user)
        try{
            const output = await recoveryDao.verifyEmail(user);

            if(output.EMAIL == user)
            {
                const cod = (Math.random() * (999999 -100000) + 100000).toFixed(0);
                await recoveryDao.generateCode(cod, output.ID);
                
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

            const output = await recoveryDao.verifyCode(code,user);
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

                const output = await recoveryDao.recovery(passwordHash, user);

                console.log(password, output.PASSWORD)

                res.json(password)
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

const recoveryLogic = new RecoveryLogic();
export default recoveryLogic;