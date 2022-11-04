import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import recoveryDao from '../dao/recoveryDAO';
import { generarJWT } from '../helpers/jwt';

class RecoveryLogic {

    async recovery(req: Request, res: Response) {
        
        const user = req.body.user;
        const password = req.body.password;

        try{
            //Se llama al sistema para cambiar contraseña
            const output = await recoveryDao.recovery(password, user);

            console.log(password, output.PASSWORD)

            res.json(password)
            
        }
        catch(err){
            console.log(err)
            res.send({status: 0, message: "Ocurrió un error"});
        }
    }
}

const recoveryLogic = new RecoveryLogic();
export default recoveryLogic;