import mysqlcon from '../db';

class RecoveryDao {

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
        const now = new Date();
        const res:any = await conn.query("UPDATE USER SET CODE = ?, DATE_CODE = ? WHERE ID=?", [CODE,now, ID]).then((res) => res[0]).catch(error => [{undefined}]);

        return res;
        
    }


    async verifyCode(CODE: string, USER: string) {
        const conn = mysqlcon.getConnection()!;
        const res:any = await conn.query("SELECT CODE,DATE_CODE FROM USER WHERE CODE = ? AND EMAIL =?", [CODE,USER]).then((res) => res[0]).catch(error => [{undefined}]);

        console.log(res)
        let login = false;
        if(res != null && res != undefined && res.length > 0) {
            login = true;
            conn.end();
            return res[0];
        } else {
            conn.end();
            console.log("Código incorrecto, intente nuevamente");
            return res;
        }
        
    }

    async recovery(PASSWORD: string ,USER: string) {
        const conn = mysqlcon.getConnection()!;
        const res:any = await conn.query("UPDATE USER SET PASSWORD = ? WHERE EMAIL = ?", [PASSWORD, USER]).then((res) => res[0]).catch(error => [{undefined}]);

        return res
        
    }
    
}

const recoveryDao = new RecoveryDao();
export default recoveryDao;