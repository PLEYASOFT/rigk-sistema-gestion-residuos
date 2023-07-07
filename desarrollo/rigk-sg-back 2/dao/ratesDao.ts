import mysqlcon from '../db';
class RatesDao {
    public async ratesID(id: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("SELECT * FROM rates WHERE year = ? ", [id]).then(res => res[0]).catch(erro => undefined);
        conn.end();
        return res;
    }
    public async getUF(date: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("SELECT * FROM uf WHERE UF_DATE = ? ", [date]).then(res => res[0]).catch(erro => undefined);
        conn.end();
        return res[0].RATE;
    }
}
const ratesDao = new RatesDao();
export default ratesDao;