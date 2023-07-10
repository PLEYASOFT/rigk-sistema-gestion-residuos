import dotenv from 'dotenv';
import mysqlcon from '../db';
import { appendFileSync, stat } from 'fs';
import path from 'path';
export const createLog = async (action: string, id_user: number|null, errorDB: string|null) => {
    const out: string = process.env.PATH_LOG!;
    try {
        let res: any;
        const conn = mysqlcon.getConnection()!;
        if (errorDB) {
            res = await conn.execute("INSERT INTO logs(ACTION, ID_USER, ERROR_LOG, STATUS) VALUES (?,?,?,'Nok')", [action, id_user||null, errorDB]).then(res => res[0]).catch(err => {console.log("=>",err); return undefined;});
        } else {
            res = await conn.execute("INSERT INTO logs(ACTION, ID_USER) VALUES (?,?)", [action, id_user||null]).then(res => res[0]).catch(err => undefined);
        }
        conn.end();
        if (res == undefined) {
            return await saveLog('GUARDADO_LOG', id_user||null, errorDB, out);
        }
        return true;
    } catch (error) {
        saveLog('GUARDADO_LOG', id_user||null, errorDB, out);
    }
};

const saveLog = async (action: string, id_user: number|null, error: string|null, _path: string) => {
    try {
        const t = path.resolve(_path);
        let status = 'Ok';
        if(error) {
            status = 'Nok';
        }
        const logFormat = `ID_USER: ${id_user}; ACTION: ${action}; ERROR_LOG: ${error}; STATUS: ${status}; CREATED_AT: ${new Date()}\n`;
        await appendFileSync(t, logFormat);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}