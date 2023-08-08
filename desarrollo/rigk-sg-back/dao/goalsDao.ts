import mysqlcon from '../db';
class GoalsDao {
    public async getAllGoals() {
        const conn = mysqlcon.getConnection()!;
        const goals: any = await conn.query("SELECT * FROM goals WHERE year >= 2021  AND year <= year(CURRENT_DATE) + 1 ORDER BY year DESC").then(res => res[0]).catch(erro => undefined);
        if (goals == null || goals.length == 0) {
            return false;
        }
        conn.end();
        return goals;
    }

    public async getGoalsYear(year: number) {
        const conn = mysqlcon.getConnection()!;
        const goals: any = await conn.query("SELECT * FROM goals WHERE year=? ORDER BY type_material", [year]).then(res => res[0]).catch(erro => undefined);
        if (goals == null || goals.length == 0) {
            return false;
        }
        conn.end();
        return goals;
    }

    public async updateGoals(data: any) {
        const conn = mysqlcon.getConnection()!;
        
        await conn.query("UPDATE goals SET PERCENTAGE_CUM=? WHERE year=? AND type_material=?", [data.type_0.replace(",",".")/100,data.year,0]).then(res => res[0]).catch(erro => undefined);
        await conn.query("UPDATE goals SET PERCENTAGE_CUM=? WHERE year=? AND type_material=?", [data.type_1.replace(",",".")/100,data.year,1]).then(res => res[0]).catch(erro => undefined);
        await conn.query("UPDATE goals SET PERCENTAGE_CUM=? WHERE year=? AND type_material=?", [data.type_2.replace(",",".")/100,data.year,2]).then(res => res[0]).catch(erro => undefined);
        await conn.query("UPDATE goals SET PERCENTAGE_CUM=? WHERE year=? AND type_material=?", [data.type_3.replace(",",".")/100,data.year,3]).then(res => res[0]).catch(erro => undefined);

        return true;
    }

    public async saveGoals(data: any) {
        const conn = mysqlcon.getConnection()!;
        const tmp:any = await conn.query("SELECT * FROM goals WHERE year=?", [data.year]).then(res => res[0]).catch(erro => undefined);
        
        if(tmp.length > 0) {
            return false;
        }
        
        await conn.query("INSERT INTO goals(PERCENTAGE_CUM,year,type_material) values(?,?,?) ", [data.type_0.replace(",",".")/100,data.year,0]).then(res => res[0]).catch(erro => undefined);
        await conn.query("INSERT INTO goals(PERCENTAGE_CUM,year,type_material) values(?,?,?) ", [data.type_1.replace(",",".")/100,data.year,1]).then(res => res[0]).catch(erro => undefined);
        await conn.query("INSERT INTO goals(PERCENTAGE_CUM,year,type_material) values(?,?,?) ", [data.type_2.replace(",",".")/100,data.year,2]).then(res => res[0]).catch(erro => undefined);
        await conn.query("INSERT INTO goals(PERCENTAGE_CUM,year,type_material) values(?,?,?) ", [data.type_3.replace(",",".")/100,data.year,3]).then(res => res[0]).catch(erro => undefined);
        
        return true;
    }
}

const goalsDao = new GoalsDao();

export default goalsDao;