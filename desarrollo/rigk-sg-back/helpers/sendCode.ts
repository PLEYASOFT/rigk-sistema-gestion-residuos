import { Response } from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';


export const sendCode = ( output: any, cod: any, res: Response ) => {

    const transporter = nodemailer.createTransport({
        pool: true,
        host: "mail.prorep.cl",
        port: 465,
        secure:true,
        auth: {
            user: "noreply@prorep.cl",
            pass: "nr_prorep_22",
        }
    });

    const mailOptions = {
        from: `PROREP noreply@prorep.cl`,
        to: `${output.EMAIL}`,
        subject: 'Código de recuperación',
        text: `Tu código de recuperación es: ${cod}`
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


