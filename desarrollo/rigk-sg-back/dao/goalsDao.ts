import mysqlcon from '../db';
class GoalsDao {
    public async getAllGoals() {
        const conn = mysqlcon.getConnection()!;
        const rates: any = await conn.query("SELECT * FROM goals WHERE year >= 2021  AND year <= year(CURRENT_DATE) + 1 ORDER BY year DESC").then(res => res[0]).catch(erro => undefined);
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
        
        await conn.query("UPDATE goals SET price=? WHERE year=? AND type_material=?", [(data.type_1.replace(",",".")),data.year,1]).then(res => res[0]).catch(erro => undefined);
        await conn.query("UPDATE goals SET price=? WHERE year=? AND type_material=?", [data.type_2.replace(",","."),data.year,2]).then(res => res[0]).catch(erro => undefined);
        await conn.query("UPDATE goals SET price=? WHERE year=? AND type_material=?", [data.type_3.replace(",","."),data.year,3]).then(res => res[0]).catch(erro => undefined);
        await conn.query("UPDATE goals SET price=? WHERE year=? AND type_material=?", [data.type_4.replace(",","."),data.year,4]).then(res => res[0]).catch(erro => undefined);
        return true;

    }
    public async saveRate(data: any) {
        const conn = mysqlcon.getConnection()!;
        const tmp:any = await conn.query("SELECT * FROM goals WHERE year=?", [data.year]).then(res => res[0]).catch(erro => undefined);
        if(tmp.length > 0) {
            return false;
        }
        
        await conn.query("INSERT INTO goals(PERCENTAGE_CUM,year,type_material) values(?,?,?) ", [data.type_1.replace(",","."),data.year,1]).then(res => res[0]).catch(erro => undefined);
        await conn.query("INSERT INTO goals(PERCENTAGE_CUM,year,type_material) values(?,?,?) ", [data.type_2.replace(",","."),data.year,2]).then(res => res[0]).catch(erro => undefined);
        await conn.query("INSERT INTO goals(PERCENTAGE_CUM,year,type_material) values(?,?,?) ", [data.type_3.replace(",","."),data.year,3]).then(res => res[0]).catch(erro => undefined);
        await conn.query("INSERT INTO goals(PERCENTAGE_CUM,year,type_material) values(?,?,?) ", [data.type_4.replace(",","."),data.year,4]).then(res => res[0]).catch(erro => undefined);
        return true;

    }

    public async UpdateRates(PRICE: string, YEAR: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("UPDATE goals SET PERCENTAGE_CUM = ? WHERE year = ?", [PRICE, YEAR]).then(res => res[0]).catch(erro => undefined);
        // UPDATE SET PRICE = ? FROM rates WHERE year = ? 
        conn.end();
        return res;
        // UPDATE rates SET price = <nuevo_precio> WHERE type = '?' AND year = '?';
    }
    // ("INSERT INTO rates(year,type,price) VALUES(?,?,?)", [year,type,price])
    public async insertRates(PRICE: string, YEAR: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("UPDATE goals SET PERCENTAGE_CUM = ? WHERE year = ?", [PRICE, YEAR]).then(res => res[0]).catch(erro => undefined);
        // UPDATE SET PRICE = ? FROM rates WHERE year = ? 
        conn.end();
        return res;
        // UPDATE rates SET price = <nuevo_precio> WHERE type = '?' AND year = '?';
    }

}
const goalsDao = new GoalsDao();
export default goalsDao;