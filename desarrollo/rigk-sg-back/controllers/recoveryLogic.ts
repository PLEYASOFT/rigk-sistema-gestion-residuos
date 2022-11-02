import { Request, Response } from 'express';


import recoveryDao from '../dao/recoveryDAO';

class RecoveryLogic {

    async recovery(req: Request, res: Response) {
        
        try{
            console.log(req.body)
            const output = await recoveryDao.recovery(req.body.user);
            res.send(output);
        }
        catch(err){
            console.log(err)
            res.send({status: 0, message: "Ocurrió un error"});
        }
    }
}

const recoveryLogic = new RecoveryLogic();
export default recoveryLogic;