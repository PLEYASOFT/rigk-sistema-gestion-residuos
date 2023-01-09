import mysqlcon from '../db';
import bcrypt from 'bcrypt';

class AuthDao {
    async getPassword(ID: string) {
        const conn = mysqlcon.getConnection()!;
        const res_passwd: any = await conn.query("SELECT PASSWORD, SALT FROM USER WHERE ID = ?", [ID]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res_passwd[0];
    }
    async updatePassword(PASSWORD: string, USER: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("UPDATE USER SET PASSWORD = ? WHERE ID = ?", [PASSWORD, USER]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res;
    }
    async login(USER: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("SELECT USER.*,USER_ROL.ROL_ID AS ROL, ROL.NAME AS ROL_NAME, BUSINESS.NAME AS BUSINESS, BUSINESS.ID as ID_BUSINESS FROM USER INNER JOIN USER_ROL ON USER_ROL.USER_ID = USER.ID INNER JOIN USER_BUSINESS ON USER_BUSINESS.ID_USER = USER.ID INNER JOIN BUSINESS ON BUSINESS.ID = USER_BUSINESS.ID_BUSINESS INNER JOIN ROL ON ROL.ID=USER_ROL.ROL_ID WHERE USER.EMAIL = ?", [USER]).then((res) => res[0]).catch(error => [{ undefined }]);
        
        let login = false;
        if (res != null && res != undefined && res.length > 0) {
            login = true;
        }

        conn.end();
        return res[0] || undefined;
    }
    async verifyEmail(USER: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("SELECT EMAIL,ID,PASSWORD FROM USER WHERE EMAIL = ?", [USER]).then((res) => res[0]).catch(error => [{ undefined }]);

        let login = false;
        conn.end();
        if (res != null && res != undefined && res.length > 0) {
            login = true;
            return res[0];
        } else {
            console.log("Correo no es correcto, intente nuevamente");
            return res;
        }

    }
    async generateCode(CODE: string, ID: string) {
        const conn = mysqlcon.getConnection()!;
        const now = new Date();
        const res: any = await conn.query("UPDATE USER SET CODE = ?, DATE_CODE = ? WHERE ID=?", [CODE, now, ID]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res;

    }
    async verifyCode(CODE: string, USER: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("SELECT CODE,DATE_CODE,ID FROM USER WHERE CODE = ? AND EMAIL =?", [CODE, USER]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        let login = false;
        if (res != null && res != undefined && res.length > 0) {
            login = true;
            return res[0];
        } else {
            console.log("Código incorrecto, intente nuevamente");
            return res;
        }

    }

    async recovery(PASSWORD: string, USER: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("UPDATE USER SET PASSWORD = ? WHERE EMAIL = ?", [PASSWORD, USER]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res

    }

    async register(EMAIL: string, FIRST_NAME: string, LAST_NAME: string, PASSWORD: string, PHONE: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("INSERT INTO user(EMAIL,FIRST_NAME,LAST_NAME, PASSWORD,PHONE, STATE, SALT) VALUES (?,?,?,?,?,?,'ABC')", [EMAIL, FIRST_NAME, LAST_NAME, PASSWORD, PHONE,1]).then((res) => res[0]).catch(error => [{ undefined }]);
        const res_1: any = await conn.query("INSERT INTO user_rol(USER_ID,ROL_ID) VALUES (?,?)", [res.insertId]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res
    }
}

const authDao = new AuthDao();
export default authDao;