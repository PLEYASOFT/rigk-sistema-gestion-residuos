import mysqlcon from '../db';

class BusinessDao {

    public async checkID(user:string, id:string) {
        const conn = mysqlcon.getConnection()!;
        const res = await conn.query("SELECT * FROM user_business WHERE ID_USER = ? AND ID_BUSINESS = ?", [user,id])
        console.log(res);
        
        let isOk = false;
        if(res != null && res != undefined) {
            isOk = true;
        }
        conn.end();
        return isOk;
    }

}

const businessDao = new BusinessDao();
export default businessDao;