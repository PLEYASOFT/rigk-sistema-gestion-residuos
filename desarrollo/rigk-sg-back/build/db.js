"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const mysql = require("mysql2/promise");
const promise_1 = __importDefault(require("mysql2/promise"));
const process_1 = require("process");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class DBConnection {
    constructor() {
        this.getConnection = () => {
            try {
                return promise_1.default.createPool({
                    connectionLimit: 30,
                    host: process_1.env.HOST,
                    database: process.env.DATABASE,
                    user: process.env.USERDB,
                    password: process.env.PASSWORD,
                });
            }
            catch (error) {
                console.log("error: ", error);
            }
        };
        this.getConnection();
    }
}
exports.default = new DBConnection();
