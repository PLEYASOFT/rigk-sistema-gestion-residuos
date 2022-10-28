import mysqlcon from '../db';


class statementDeclaretionDao {

    async getDeclaretionByYear(business: string, year: string) {
        const conn = mysqlcon.getConnection();
        const res_header: any = await conn?.query("SELECT * FROM header_statement_form WHERE ID_BUSINESS = ? AND YEAR_STATEMENT = ?",[business, year]).then((res) => res[0]).catch(error => {undefined});
        const id_statement = res_header[0].ID;
        const res_detail: any = await conn?.query("SELECT * FROM detail_statement_form WHERE ID_HEADER = ?",[id_statement]).then((res) => res[0]).catch(error => {undefined});

        return {header: res_header[0], detail: res_detail[0]};

    }

}

const statementDao = new statementDeclaretionDao();
export default statementDao;