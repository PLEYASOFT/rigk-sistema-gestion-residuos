import { Response } from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';


export const sendCode = ( output: any, cod: any, res: Response ) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `${process.env.EMAIL_ADDRESS}`,
            pass: `${process.env.EMAIL_PASSWORD}`,
        }
    });

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


