import mysqlcon from '../db';
class MaintainerRatesDao {
    public async getAllRates(id: string, year: string) {
        const conn = mysqlcon.getConnection()!;
        const business: any = await conn.query("SELECT business.* FROM user_business INNER JOIN business on business.ID = user_business.ID_BUSINESS WHERE user_business.ID_USER=? GROUP BY user_business.ID_BUSINESS", [id]).then(res => res[0]).catch(erro => {
            return undefined
        });
        const statements: any = await conn.query("SELECT header_statement_form.STATE, header_statement_form.ID_BUSINESS FROM header_statement_form inner join user_business ON user_business.ID_BUSINESS = header_statement_form.ID_BUSINESS  WHERE user_business.ID_USER=? AND header_statement_form.YEAR_STATEMENT=? GROUP BY user_business.ID_BUSINESS", [id, year]).then(res => res[0]).catch(erro => undefined);
        if (business == null || business.length == 0) {
            return false;
        }
        conn.end();
        return {business, statements};
    }
}
const maintainerRatesDao = new MaintainerRatesDao();
export default maintainerRatesDao;
