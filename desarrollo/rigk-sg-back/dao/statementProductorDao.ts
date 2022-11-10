import mysqlcon from '../db';

class statementProductorDao {

    public async getDeclaretionByYear(business: string, year: string) {
        const conn = mysqlcon.getConnection();
        const res_header: any = await conn?.execute("SELECT * FROM header_statement_form WHERE ID_BUSINESS = ? AND YEAR_STATEMENT = ?",[business, year]).then((res) => res[0]).catch(error => {undefined});
        const id_statement = res_header[0].ID;
        const res_detail: any = await conn?.execute("SELECT * FROM detail_statement_form WHERE ID_HEADER = ?",[id_statement]).then((res) => res[0]).catch(error => {undefined});

        return {header: res_header[0], detail: res_detail};
    }

    public async saveDeclaretion(header: any, detail: any[]) {
        const {id_business, year_statement, state, created_by} = header;
        console.log(header);
        const conn = mysqlcon.getConnection();
        const resp: any = await conn?.execute("INSERT INTO header_statement_form(ID_BUSINESS,YEAR_STATEMENT,STATE,CREATED_BY) VALUES (?,?,?,?)", [id_business,year_statement,state,created_by]).then(res=>res[0]).catch(error => {console.log(error)});
        
        for (let i = 0; i < detail.length; i++) {
            const {id_header, precedence,hazard,recyclability,type_residue,value,amount} = detail[i];
            await conn?.execute("INSERT INTO detail_statement_form(ID_HEADER,PRECEDENCE,HAZARD,RECYCLABILITY,TYPE_RESIDUE,VALUE, AMOUNT) VALUES (?,?,?,?,?,?,?)",[resp.insertId, precedence,hazard,recyclability,type_residue,value, amount]).catch(err=>console.log(err));
        }
        return {id_header: resp.insertId};
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