import { Response } from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import mysqlcon from '../db';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
export const sendOC = async ( id: any, file: any ) => {
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
    const data: any = await conn.query("SELECT header_statement_form.YEAR_STATEMENT, business.CODE_BUSINESS FROM header_statement_form INNER JOIN business ON business.ID = header_statement_form.ID_BUSINESS WHERE header_statement_form.ID=?", [id]).then((res) => res[0]).catch(error => [{ undefined }]);
    conn.end();
    const code_business = data[0].CODE_BUSINESS;
    const year = data[0].YEAR_STATEMENT;

    const mailOptions: MailOptions = {
        from: `PROREP noreply@prorep.cl`,
        to: process.env.EMAIL_OC,
        subject: 'Envio ',
        attachments: [
            {filename: file.name, content: file.data}
        ],
        text: `PROREP Informa:\n\nSe validó la declaración de la empresa ${code_business} año ${year}.\n\nAdjunto se encuentra OC.\n\nSaludos,\n\nEquipo PROREP\n\nPor favor, no responda a este email. Para más información, escriba a info@prorep.cl`
    };
    transporter.sendMail(mailOptions, (err, response) => {
        if(err){
            console.error('Ha ocurrido un error:',err);
            return false;
        }
        return true;
    });
}