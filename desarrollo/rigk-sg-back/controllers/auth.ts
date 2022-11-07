import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import mysqlcon from '../models/db';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export const modifyPassword = async (req:Request, res:Response) => {
    const {password ,newPassword, email} = req.body;

    try {
        const conn = mysqlcon.getConnection()!;
        const res_passwd:any = await conn.query("SELECT PASSWORD, SALT FROM USER WHERE EMAIL = ?", [email]).then((res) => res[0]).
        catch(error => [{undefined}]);
            bcrypt.compare(password, res_passwd.PASSWORD).then(async (r) => {
                if (r){
                    const res_update:any = await conn.query("UPDATE USER SET PASSWORD = ? WHERE EMAIL = ?", [newPassword, email]).then((res) => res[0]).catch(error => [{undefined}]);
                    if (res_update[0] !==undefined){
                        res.json({status:true})
                    }
                }    
            });
    } catch (error) {
        
    }

}