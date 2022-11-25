import mysqlcon from '../db';

class statementProductorDao {

    public async getDeclaretionByYear(business: string, year: string, isDraft: number) {
        let res_header: any;
        let res_detail: any;

        const conn = mysqlcon.getConnection();

        const res_business: any = await conn?.execute("SELECT * FROM business WHERE ID = ?", [business]).then((res) => res[0]).catch(error => { undefined });
        if (res_business.length == 0) {
            return false;
        }

        res_header = await conn?.execute("SELECT * FROM header_statement_form WHERE ID_BUSINESS = ? AND YEAR_STATEMENT = ? AND STATE = ? ORDER BY ID DESC", [business, year, Math.abs(isDraft - 1)]).then((res) => res[0]).catch(error => { undefined });
        if (res_header.length == 0) {
            return false;
        }
        const id_statement = res_header[0].ID;
        res_detail = await conn?.execute("SELECT * FROM detail_statement_form WHERE ID_HEADER = ?", [id_statement]).then((res) => res[0]).catch(error => { undefined });

        return { header: res_header[0], detail: res_detail };
    }

    public async saveDeclaretion(header: any, detail: any[]) {
        const { id_business, year_statement, state, created_by } = header;
        const conn = mysqlcon.getConnection();
        let id_header = 0;

        if (header.id_statement) {
            id_header = header.id_statement;
        } else {
            const resp: any = await conn?.execute("INSERT INTO header_statement_form(ID_BUSINESS,YEAR_STATEMENT,STATE,CREATED_BY) VALUES (?,?,?,?)", [id_business, year_statement, state, created_by]).then(res => res[0]).catch(error => { console.log(error) });
            id_header = resp.insertId;
        }

        for (let i = 0; i < detail.length; i++) {
            const { precedence, hazard, recyclability, type_residue, value, amount } = detail[i];
            if (detail[i].id) {
                await conn?.execute("UPDATE detail_statement_form SET VALUE = ? WHERE ID=?", [value, detail[i].id]);
            } else {
                await conn?.execute("INSERT INTO detail_statement_form(ID_HEADER,PRECEDENCE,HAZARD,RECYCLABILITY,TYPE_RESIDUE,VALUE, AMOUNT) VALUES (?,?,?,?,?,?,?)", [id_header, precedence, hazard, recyclability, type_residue, value, amount]).catch(err => console.log(err));
            }
        }
        return { id_header: id_header };
    }
    public async updateValueStatement(id_header: any, detail: any[]) {
        const conn = mysqlcon.getConnection();
        await conn?.execute("UPDATE header_statement_form SET STATE = true WHERE id = ?", [id_header]).then((res) => res[0]).catch(error => undefined);

        for (let i = 0; i < detail.length; i++) {
            const { precedence, hazard, recyclability, type_residue, value, amount } = detail[i];
            if (detail[i].id) {
                await conn?.execute("UPDATE detail_statement_form SET VALUE = ? WHERE ID=?", [value, detail[i].id]);
            } else {
                await conn?.execute("INSERT INTO detail_statement_form(ID_HEADER,PRECEDENCE,HAZARD,RECYCLABILITY,TYPE_RESIDUE,VALUE, AMOUNT) VALUES (?,?,?,?,?,?,?)", [id_header, precedence, hazard, recyclability, type_residue, value, amount]).catch(err => console.log(err));
            }
        }
        return;
    }


    public async changeStateHeader(state: boolean, id: number) {
        const conn = mysqlcon.getConnection();
        const tmp = await conn?.execute("UPDATE header_statement_form SET STATE = ? WHERE id = ?", [state, id]).then((res) => res[0]).catch(error => undefined);
        if (tmp == undefined) {
            return false;
        }
        return true;
    }

    public async haveDraft(business: string, year: string) {
        const conn = mysqlcon.getConnection();
        const res: any = await conn?.execute("SELECT id FROM header_statement_form WHERE ID_BUSINESS=? AND YEAR_STATEMENT=? AND STATE=1 ORDER BY ID DESC LIMIT 1", [business, year]).then((res) => res[0]).catch(error => undefined);
        let isOk = false;
        if (res != null && res != undefined && res.length > 0) {
            isOk = true;
            conn?.end();
            return isOk
        } else {
            conn?.end();
            return isOk
        }
    }
}

const statementDao = new statementProductorDao();
export default statementDao;