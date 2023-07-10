import dotenv from 'dotenv';
import mysqlcon from '../db';
import fs from 'fs';
import path from 'path';
export const createLog = async (action: string, id_user: number | null, errorDB: string | null) => {
    const out: string = process.env.PATH_LOG!;
    try {

        let res: any;
        const conn = mysqlcon.getConnection()!;
        if (errorDB) {
            res = await conn.execute("INSERT INTO logs(ACTION, ID_USER, ERROR_LOG, STATUS) VALUES (?,?,?,'Nok')", [action, id_user || null, errorDB]).then(res => res[0]).catch(err => { console.log("=>", err); return undefined; });
        } else {
            res = await conn.execute("INSERT INTO logs(ACTION, ID_USER) VALUES (?,?)", [action, id_user || null]).then(res => res[0]).catch(err => undefined);
        }
        conn.end();
        if (res == undefined) {
            return await saveLog('GUARDADO_LOG', id_user || null, errorDB, out);
        }
        return true;
    } catch (error) {
        saveLog('GUARDADO_LOG', id_user || null, errorDB, out);
    }
};

const getLastId = (_path: string): number => {
    if (fs.existsSync(_path)) {
        const data = fs.readFileSync(_path, 'utf8');
        const lines = data.split('\n');
        if (lines.length > 1) {
            const lastLine = lines[lines.length - 2];
            const lastIdString = lastLine.split(';')[0];
            const lastIdNumber = Number(lastIdString.replace('ID: ', ''));
            return isNaN(lastIdNumber) ? 0 : lastIdNumber;
        }
    }
    return 0;
};

const saveLog = async (action: string, id_user: number | null, error: string | null, _path: string) => {
    try {
        const t = path.resolve(_path);
        let status = 'Ok';
        if (error) {
            status = 'Nok';
        }

        let date = new Date();

        let day = String(date.getDate()).padStart(2, '0');
        let month = String(date.getMonth() + 1).padStart(2, '0'); //Los meses en JavaScript comienzan desde 0
        let year = date.getFullYear();

        let hours = String(date.getHours()).padStart(2, '0');
        let minutes = String(date.getMinutes()).padStart(2, '0');
        let seconds = String(date.getSeconds()).padStart(2, '0');

        let formattedDate = `${day}/${month}/${year}  ${hours}:${minutes}:${seconds}`;

        const lastId = getLastId(t);
        const newId = lastId + 1;

        const logFormat = `ID: ${newId}; MARCA DE TIEMPO: ${formattedDate}; USUARIO: ${id_user}; ACCION: ${action}; RESULTADO: ${status}; DETALLE: ${error}\n`;
        await fs.promises.appendFile(t, logFormat);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};