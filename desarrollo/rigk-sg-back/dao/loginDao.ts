import mysqlcon from '../db';


class LoginDao {
    async login(USER: string) {
        const conn = mysqlcon.getConnection()!;
        const res:any = await conn.query("SELECT FIRST_NAME, LAST_NAME,PASSWORD, SALT FROM USER WHERE EMAIL = ?", [USER]).then((res) => res[0]).catch(error => [{undefined}]);

        let login = false;
        if(res != null && res != undefined) {
            login = true;
        } else {
            console.log("Usuario y/o password incorrectas");
        }
        conn.end();
        return res[0];
    }
}

const loginDao = new LoginDao();
export default loginDao;