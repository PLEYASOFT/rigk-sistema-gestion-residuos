import mysqlcon from '../db';


class SendCodeDao {

    async verifyEmail(USER: string) {
        const conn = mysqlcon.getConnection()!;
        const res:any = await conn.query("SELECT EMAIL,ID FROM USER WHERE EMAIL = ?", [USER]).then((res) => res[0]).catch(error => [{undefined}]);

        let login = false;
        if(res != null && res != undefined && res.length > 0) {
            login = true;
            conn.end();
            return res[0];
        } else {
            conn.end();
            console.log("Correo no es correcto, intente nuevamente");
            return res;
        }
        
    }

    async generateCode(CODE: string, ID: string) {
        const conn = mysqlcon.getConnection()!;
        const res:any = await conn.query("UPDATE USER SET CODE = ?, DATE_CODE = NOW() WHERE ID=?", [CODE, ID]).then((res) => res[0]).catch(error => [{undefined}]);

        return res;
        
    }

    async date(USER: Date) {
        const conn = mysqlcon.getConnection()!;
        const res:any = await conn.query("SELECT DATE_CODE FROM USER WHERE EMAIL = ?", [USER]).then((res) => res[0]).catch(error => [{undefined}]);

        let login = false;
        if(res != null && res != undefined && res.length > 0) {
            login = true;
            conn.end();
            return res[0];
        } else {
            conn.end();
            console.log("Correo no es correcto, intente nuevamente");
            return res;
        }
        
    }
    
}

const sendCodeDao = new SendCodeDao();
export default sendCodeDao;