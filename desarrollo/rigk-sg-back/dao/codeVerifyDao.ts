import mysqlcon from '../db';


class CodeVerifyDao {

    async verifyCode(CODE: string) {
        const conn = mysqlcon.getConnection()!;
        const res:any = await conn.query("SELECT EMAIL,ID,CODE,PASSWORD FROM USER WHERE CODE = ?", [CODE]).then((res) => res[0]).catch(error => [{undefined}]);

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

    async expiracionCode(ID: string) {
        const conn = mysqlcon.getConnection()!;
        const res:any = await conn.query("UPDATE USER DATE_CODE = ? WHERE ID=?", [null, ID]).then((res) => res[0]).catch(error => [{undefined}]);

        console.log(res)
        
        return res;
        
    }

    
}

const codeVerifyDao = new CodeVerifyDao();
export default codeVerifyDao;