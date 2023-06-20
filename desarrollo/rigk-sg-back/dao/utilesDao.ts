import mysqlcon from '../db';

class UtilesDao {
    //
    public async postFilePDF(PDF: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("INSERT INTO user(FILE) VALUES (?)", [PDF]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res;
    }
}
const utilesDao = new UtilesDao();
export default utilesDao;