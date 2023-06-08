import { Response } from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import mysqlcon from '../db';
export const sendCode = async ( output: any, cod: any, res: Response ) => {
    const transporter = nodemailer.createTransport({
        pool: true,
        host: "mail.prorep.cl",
        port: 465,
        secure:true,
        auth: {
            user: `${process.env.EMAIL_ADDRESS}`,
            pass: `${process.env.EMAIL_PASSWORD}`,
        }
    });
    const conn = mysqlcon.getConnection()!;
    const result: any = await conn.query("SELECT FIRST_NAME,LAST_NAME FROM user WHERE EMAIL =?", [output.EMAIL]).then((res) => res[0]).catch(error => [{ undefined }]);
    const mailOptions = {
        from: `PROREP noreply@prorep.cl`,
        to: `${output.EMAIL}`,
        subject: 'Código de recuperación',
        text: `${result[0].FIRST_NAME} ${result[0].LAST_NAME}, el código para la recuperación de su contraseña es:\n\n${cod}\n\nSaludos,\n\nEquipo PROREP\n\nPor favor, no responda a este email. Para más información, escriba a info@prorep.cl`
    };
    transporter.sendMail(mailOptions, (err, response) => {
        if(err){
            console.error('Ha ocurrido un error:',err);
        } else{
            console.log('Respuesta:', response);
            res.status(200).json('El email para la recuperación ha sido enviado');
        }
    });
}