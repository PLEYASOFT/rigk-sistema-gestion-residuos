import mysqlcon from '../db';

class statementProductorDao {

    public async getDeclaretionByYear(business: string, year: string) {
        const conn = mysqlcon.getConnection();
        const res_header: any = await conn?.execute("SELECT * FROM header_statement_form WHERE ID_BUSINESS = ? AND YEAR_STATEMENT = ?",[business, year]).then((res) => res[0]).catch(error => {undefined});
        const id_statement = res_header[0].ID;
        const res_detail: any = await conn?.execute("SELECT * FROM detail_statement_form WHERE ID_HEADER = ?",[id_statement]).then((res) => res[0]).catch(error => {undefined});

        return {header: res_header[0], detail: res_detail[0]};
    }

    public async saveDeclaretion(header: any, detail: any[]) {
        const {id_business, year_statement, state, creater_by} = header;
        const conn = mysqlcon.getConnection();
        const id = await conn?.execute("INSERT INTO header_statement_form(ID_BUSINESS,YEAR_STATEMENT,STATE,CREATER_BY) VALUES (?,?,?,?) RETURNING id", [id_business,year_statement,state,creater_by]).then((res) => res[0]).catch(error => {undefined});
        for (let i = 0; i < detail.length; i++) {
            const {id_header, precedence,hazard,recyclability,type_residue,value} = detail[i];
            await conn?.execute("INSERT INTO detail_statement_form(ID_HEADER,PRECEDENCE,HAZARD,RECYCLABILITY,TYPE_RESIDUE,VALUE) VALUES (?,?,?,?,?,?)",[id_header, precedence,hazard,recyclability,type_residue,value]);
        }
        return {id_header: id};
    }

    public async changeStateHeader(state:boolean, id:number) {
        const conn = mysqlcon.getConnection();
        const tmp = await conn?.execute("UPDATE header_statement_form SET STATE = ? WHERE id = ?", [state, id]).then((res) => res[0]).catch(error => undefined);
        if(tmp == undefined) {
            return false;
        }
        return true;
    }

}

const statementDao = new statementProductorDao();
export default statementDao;