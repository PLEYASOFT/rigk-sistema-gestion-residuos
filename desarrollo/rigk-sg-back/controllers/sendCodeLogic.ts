import { Request, Response } from 'express';


import sendCodeDao from '../dao/sendCodeDao';

class SendCodeLogic {

    async sendCode(req: Request, res: Response) {
        
        try{
            console.log(req.body)
            const output = await sendCodeDao.sendCode(req.body.user);
            res.send(output);
        }
        catch(err){
            console.log(err)
            res.send({status: 0, message: "Ocurrió un error"});
        }
    }
}

const sendCodeLogic = new SendCodeLogic();
export default sendCodeLogic;