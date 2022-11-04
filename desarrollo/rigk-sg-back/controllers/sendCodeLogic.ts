import { Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

import sendCodeDao from '../dao/sendCodeDao';

class SendCodeLogic {

    async sendCode(req: Request, res: Response) {

        const user = req.body.user;

        try{
            const output = await sendCodeDao.verifyEmail(user);

            if(output.EMAIL == user)
            {
                const cod = (Math.random() * (999999 -100000) + 100000).toFixed(0);
                await sendCodeDao.generateCode(cod, output.ID);
                
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: `${process.env.EMAIL_ADDRESS}`,
                        pass: `${process.env.EMAIL_PASSWORD}`,
                    }
                });
                
                /*const id = output.ID;

                const payload = {id , user};
    
                const expiration:any =  await new Promise( (resolve, reject) => {
                    jwt.sign( payload, process.env.SECRET_JWT_SEED!, {
                            expiresIn: '1m'
        }, (err: any, token: unknown) => {
    
            if ( err ) {
                // TODO MAL
                console.log(err);
                reject(err);
    
            } else {
                // TODO BIEN
                resolve( token )
            }
        })
    });

                const prueba = jwt.verify( expiration, process.env.SECRET_JWT_SEED! );

                console.log(prueba, "----------", Date.now());

                const date = await sendCodeDao.date(user);
                var expiryDate = new Date( date.DATE_CODE + 60 * 60 * 1000 );
                console.log(date.DATE_CODE, "-----", expiryDate);*/

                const mailOptions = {
                    from: 'correodepruebajuanoxx@gmail.com',
                    to: `${output.EMAIL}`,
                    subject: 'Correo de prueba',
                    text: `Tu código de verificación es: ${cod}`

                }

                transporter.sendMail(mailOptions, (err, response) => {
                    if(err){
                        console.error('Ha ocurrido un error:',err);
                    } else{
                        console.log('Respuesta:', response);
                        res.status(200).json('El email para la recuperación ha sido enviado');
                    }
                    
                })
            }
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