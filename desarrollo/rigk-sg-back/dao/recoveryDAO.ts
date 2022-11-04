import mysqlcon from '../db';


class RecoveryDao {

    async recovery(PASSWORD: string ,USER: string) {
        const conn = mysqlcon.getConnection()!;
        const res:any = await conn.query("UPDATE USER SET PASSWORD = ? WHERE EMAIL = ?", [PASSWORD, USER]).then((res) => res[0]).catch(error => [{undefined}]);

        console.log(res)
        return res
        
    }
}

const recoveryDao = new RecoveryDao();
export default recoveryDao;