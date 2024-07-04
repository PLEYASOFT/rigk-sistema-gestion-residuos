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
    public async getAllRates() {
        const conn = mysqlcon.getConnection()!;
        const rates: any = await conn.query("SELECT * FROM rates WHERE year >= 2021  AND year <= year(CURRENT_DATE) + 1 ORDER BY year DESC").then(res => res[0]).catch(erro => undefined);
        // SELECT * FROM rates
        // SELECT type, price, year FROM rates WHERE type IN ('1', '2', '3', '4') AND year >= '2021' AND year <= YEAR(CURRENT_DATE)
        if (rates == null || rates.length == 0) {
            return false;
        }
        conn.end();
        return rates;
    }

    public async updateRatesByYear(data: any) {
        const conn = mysqlcon.getConnection()!;
        const tmp:any = await conn.query("SELECT * FROM header_statement_form WHERE YEAR_STATEMENT = ? AND STATE>0", [data.year]).then(res => res[0]).catch(erro => undefined);
        if(tmp.length > 0) {
            return false;
        }
        
        await conn.query("UPDATE rates SET price=? WHERE year=? AND type=?", [(data.type_1.replace(",",".")),data.year,1]).then(res => res[0]).catch(erro => undefined);
        await conn.query("UPDATE rates SET price=? WHERE year=? AND type=?", [data.type_2.replace(",","."),data.year,2]).then(res => res[0]).catch(erro => undefined);
        await conn.query("UPDATE rates SET price=? WHERE year=? AND type=?", [data.type_3.replace(",","."),data.year,3]).then(res => res[0]).catch(erro => undefined);
        await conn.query("UPDATE rates SET price=? WHERE year=? AND type=?", [data.type_4.replace(",","."),data.year,4]).then(res => res[0]).catch(erro => undefined);
        return true;

    }
    public async saveRate(data: any) {
        const conn = mysqlcon.getConnection()!;
        const tmp:any = await conn.query("SELECT * FROM rates WHERE year=?", [data.year]).then(res => res[0]).catch(erro => undefined);
        if(tmp.length > 0) {
            return false;
        }
        
        await conn.query("INSERT INTO rates(price,year,type) values(?,?,?) ", [data.type_1.replace(",","."),data.year,1]).then(res => res[0]).catch(erro => undefined);
        await conn.query("INSERT INTO rates(price,year,type) values(?,?,?) ", [data.type_2.replace(",","."),data.year,2]).then(res => res[0]).catch(erro => undefined);
        await conn.query("INSERT INTO rates(price,year,type) values(?,?,?) ", [data.type_3.replace(",","."),data.year,3]).then(res => res[0]).catch(erro => undefined);
        await conn.query("INSERT INTO rates(price,year,type) values(?,?,?) ", [data.type_4.replace(",","."),data.year,4]).then(res => res[0]).catch(erro => undefined);
        return true;

    }

    public async UpdateRates(PRICE: string, YEAR: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("UPDATE rates SET PRICE = ? WHERE year = ?", [PRICE, YEAR]).then(res => res[0]).catch(erro => undefined);
        // UPDATE SET PRICE = ? FROM rates WHERE year = ? 
        conn.end();
        return res;
        // UPDATE rates SET price = <nuevo_precio> WHERE type = '?' AND year = '?';
    }
    // ("INSERT INTO rates(year,type,price) VALUES(?,?,?)", [year,type,price])
    public async insertRates(PRICE: string, YEAR: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("UPDATE rates SET PRICE = ? WHERE year = ?", [PRICE, YEAR]).then(res => res[0]).catch(erro => undefined);
        // UPDATE SET PRICE = ? FROM rates WHERE year = ? 
        conn.end();
        return res;
        // UPDATE rates SET price = <nuevo_precio> WHERE type = '?' AND year = '?';
    }

}
const ratesDao = new RatesDao();
export default ratesDao;