import mysqlcon from '../db';

class UtilesDao {
    public async postFilePDF(PDF: string, ID_USER: number, BUSINESS_CODE: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("UPDATE user_business set DJ_FILE=? WHERE ID_USER=? AND ID_BUSINESS=?", [PDF, ID_USER, BUSINESS_CODE]).then((res) => res[0]).catch(error => { console.log(error); return [{ undefined }] });
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

    async findFile(ID_USER: string, BUSINESS_CODE: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("SELECT DJ_FILE FROM user_business WHERE ID_USER=? AND ID_BUSINESS=?", [ID_USER, BUSINESS_CODE]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        if (res.length == 0){
            return false
        }
        return res[0].DJ_FILE
    }

    async downloadMV(ID_ATTACHED: any) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("SELECT FILE FROM attached_productor_form WHERE ID=?", [ID_ATTACHED]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        if (res.length == 0){
            return false
        }
        return res[0].FILE
    }
}
const utilesDao = new UtilesDao();
export default utilesDao;