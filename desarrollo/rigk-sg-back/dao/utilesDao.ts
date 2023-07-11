import mysqlcon from '../db';

class UtilesDao {
    //
    public async postFilePDF(PDF: string, ID: number) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("UPDATE user set FILE=? WHERE ID=?", [PDF, ID]).then((res) => res[0]).catch(error => { console.log(error); return [{ undefined }] });
        conn.end();
        return res;
    }
    async verifyUser(USER: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("SELECT ID FROM user WHERE FILE IS NULL AND ID=?", [USER]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        if (res.length == 0){
            return true
        }
        return false
    }

    async findFile(USER: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("SELECT FILE FROM user WHERE ID=?", [USER]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        if (res.length == 0){
            return false
        }
        return res[0].FILE
    }
}
const utilesDao = new UtilesDao();
export default utilesDao;