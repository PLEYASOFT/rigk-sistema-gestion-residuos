import mysqlcon from '../db';

class BusinessDao {

    public async checkID(user: string, id: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("SELECT * FROM user_business WHERE ID_USER = ? AND ID_BUSINESS = ?", [user, id]).then(res => res[0]).catch(erro => undefined);

        let isOk = false;
        if ((res != null && res != undefined) && res.length > 0) {
            isOk = true;
        }
        conn.end();
        return isOk;
    }
}

const businessDao = new BusinessDao();
export default businessDao;
