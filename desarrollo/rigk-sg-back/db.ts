// const mysql = require("mysql2/promise");
import mysql from 'mysql2/promise';
import { env } from 'process';
import dotenv from 'dotenv';

dotenv.config();

class DBConnection {
    constructor() {
        this.getConnection();
    }
    getConnection = () => {
        try {
            return mysql.createPool({
                connectionLimit: 30,
                host: env.HOST,
                database: process.env.DATABASE,
                user: process.env.USERDB,
                password: process.env.PASSWORD,
            });
        } catch (error) {
            console.log("error: ", error);
        }
    };
}

export default new DBConnection();