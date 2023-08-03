import mysql from 'mysql2/promise';
import { env } from 'process';
import dotenv from 'dotenv';

dotenv.config();

class DBConnection {
    public mainConnection: mysql.Pool | null = null;
    public etlConnection: mysql.Pool | null = null;

    constructor() {
        this.mainConnection = this.getConnection();
        this.etlConnection = this.getEtlConnection(); 
    }

    getConnection = () => {
        try {
            return mysql.createPool({
                connectionLimit: 30,
                host: env.HOST,
                database: process.env.DATABASE,
                user: process.env.USERDB,
                password: process.env.PASSWORD
            });
        } catch (error: any) {
            console.log("El error es: ", error);
            return null;
        }
    };

    getEtlConnection = () => {
        try {
            return mysql.createPool({
                connectionLimit: 30,
                host: env.HOST, 
                database: process.env.DATABASE_ETL, 
                user: process.env.USERDB, 
                password: process.env.PASSWORD 
            });
        } catch (error: any) {
            console.log("El error es: ", error);
            return null;
        }
    };
}

export default new DBConnection();
