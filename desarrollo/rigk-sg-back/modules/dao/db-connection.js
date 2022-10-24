const mysql = require("mysql2/promise");

class DBConnection {
    constructor() {
        this.getConnection = () => {
            try {
                return mysql.createPool({
                    connectionLimit: 30,
                    host: process.env.HOST,
                    database: process.env.DATABASE,
                    user: process.env.USER,
                    password: process.env.PASSWORD,
                });
            } catch (error) {
                console.log("error: ", error);
            }
        };
    }
}

module.exports = new DBConnection();