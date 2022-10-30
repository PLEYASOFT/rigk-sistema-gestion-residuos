import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

// const loginDao = require('../dao/login-dao');
import loginDao from '../dao/loginDao';
import { generarJWT } from '../helpers/jwt';



class LoginLogic {
    async login(req: Request, res: Response) {
        
        const user = req.body.user;
        const password = req.body.password;

        let passworHash = bcrypt.hashSync(password, 8);
        
        try{
            
            const output = await loginDao.login(user);
            bcrypt.compare(password, output.PASSWORD).then(async (r) => {
                if(r){
                    const token = await generarJWT(user, `${output.FIRST_NAME} ${output.LAST_NAME}`, "");
                    res.json(token);
                }
                else{
                    res.send('No Pasó :(');                }
            });
            
        }
        catch(err){
            console.log(err)
            res.send({status: 0, message: "Ocurrió un error"});
        }
    }

    test(req: Request, res: Response) {
        const {id} = req.params;

        res.json({status:true});
    }
}

const loginLogic = new LoginLogic();
export default loginLogic;