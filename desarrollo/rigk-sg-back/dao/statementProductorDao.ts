import mysqlcon from '../db';
import ratesDao from '../dao/ratesDao';
class statementProductorDao {
    public async getDeclaretionsByUser(user: string) {
        const conn = mysqlcon.getConnection();
        const statements = await conn?.execute("SELECT header_statement_form.ID, header_statement_form.ID_BUSINESS, header_statement_form.STATE, header_statement_form.CREATED_BY, header_statement_form.UPDATED_AT, header_statement_form.VALIDATED_AT,  header_statement_form.YEAR_STATEMENT, business.NAME as NAME_BUSINESS, business.CODE_BUSINESS, SUM(detail_statement_form.AMOUNT) as AMOUNT  FROM header_statement_form INNER JOIN business ON business.id = header_statement_form.ID_BUSINESS INNER JOIN detail_statement_form ON detail_statement_form.ID_HEADER = header_statement_form.ID WHERE ID_BUSINESS in (SELECT ID_BUSINESS FROM user_business WHERE ID_USER=?) GROUP BY header_statement_form.ID", [user]).then((res) => res[0]).catch(error => { undefined });
        conn?.end();
        return { statements };
    }    
    public async getProductor(id: string) {
        const conn = mysqlcon.getConnection();
        const statements = await conn?.execute("SELECT FIRST_NAME, LAST_NAME from user WHERE ID = ?", [id]).then((res) => res[0]).catch(error => { undefined });
        conn?.end();
        return { statements };
    }
    public async saveFile(idDetail: number, fileName: string, fileBuffer: File, typeMaterial: number) {
        const conn = mysqlcon.getConnection()!;
        const attached: any = await conn.execute("INSERT INTO attached_productor_form(ID_HEADER, FILE_NAME, FILE, TYPE_MATERIAL) VALUES (?,?,?,?)", [idDetail, fileName, fileBuffer, typeMaterial]).then((res) => res[0]).catch(error => { console.log(error); return [{ undefined }] });
        conn.end();
        return { attached };
    }
    public async getMV(id_header: any) {
        const conn = mysqlcon.getConnection()!;
        const header: any = await conn.execute(`
            SELECT
                attached_productor_form.ID,
                attached_productor_form.FILE_NAME,
                attached_productor_form.TYPE_MATERIAL,
                CASE attached_productor_form.TYPE_MATERIAL
                    WHEN 1 THEN 'Papel/Cartón'
                    WHEN 2 THEN 'Metal'
                    WHEN 3 THEN 'Plástico'
                    ELSE 'Desconocido'
                END AS TYPE_MATERIAL_TIPEADO
            FROM
                attached_productor_form
            WHERE
                attached_productor_form.ID_HEADER = ?`, [id_header]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return { header };
    }
    public async deleteById(id: number) {
        const conn = mysqlcon.getConnection()!;
        const result: any = await conn.execute("DELETE FROM attached_productor_form WHERE ID = ?", [id]).then((res) => res[0]).catch(error => { console.log(error); return [{ undefined }] });
        conn.end();
        return result;
    }
    public async getDeclaretionByYear(business: string, year: string, isDraft: number) {
        let res_header: any;
        let res_detail: any;
        const conn = mysqlcon.getConnection();
        const res_business: any = await conn?.execute("SELECT * FROM business WHERE CODE_BUSINESS = ?", [business]).then((res) => res[0]).catch(error => { console.log(error); return undefined });
        if (res_business.length == 0) {
            return false;
        }
        const draft = isDraft == 2 ? isDraft: Math.abs(isDraft-1)
        res_header = await conn?.execute("SELECT header_statement_form.*, business.name as BUSINESS_NAME, user.FIRST_NAME as USER_FIRSTNAME, user.LAST_NAME as USER_LASTNAME FROM header_statement_form INNER JOIN business on business.ID = header_statement_form.ID_BUSINESS INNER JOIN user ON user.ID = header_statement_form.CREATED_BY WHERE header_statement_form.ID_BUSINESS = ? AND header_statement_form.YEAR_STATEMENT = ? AND header_statement_form.STATE = ? ORDER BY ID DESC", [res_business[0].ID, year, draft]).then((res) => res[0]).catch(error => { console.log(error); return undefined });
        if (res_header.length == 0) {
            return false;
        }
        const id_statement = res_header[0].ID;
        res_detail = await conn?.execute("SELECT * FROM detail_statement_form WHERE ID_HEADER = ?", [id_statement]).then((res) => res[0]).catch(error => { undefined });
        conn?.end();
        return { header: res_header[0], detail: res_detail };
    }

    public async getBusinessByRolProductor(){
        const conn = mysqlcon.getConnection();

        const res_business: any = await conn?.execute(`SELECT DISTINCT business.ID, business.NAME, business.VAT, business.CODE_BUSINESS
        FROM business
        JOIN user_business ON business.ID = user_business.ID_BUSINESS
        JOIN user ON user_business.ID_USER = user.ID
        JOIN user_rol ON user.ID = user_rol.USER_ID
        JOIN rol ON user_rol.ROL_ID = rol.ID
        WHERE rol.NAME = 'Productor' AND user.STATE = '1';`).then((res) => res[0]).catch(error => { undefined });
                                               
        if (res_business.length == 0) {
            return false;
        }
        conn?.end();
        return { res_business };
    }
    
    public async getAllStatementByYear(year: string) {
        const conn = mysqlcon.getConnection();

        const res_business: any = await conn?.execute("SELECT DISTINCT h.ID AS ID_HEADER, h.ID_BUSINESS, h.STATE, h.CREATED_BY, h.UPDATED_AT, b.AM_FIRST_NAME, b.AM_LAST_NAME, b.CODE_BUSINESS, b.EMAIL, b.GIRO, b.INVOICE_EMAIL, b.INVOICE_NAME, b.INVOICE_PHONE, b.LOC_ADDRESS, b.NAME, b.PHONE, b.VAT FROM header_statement_form h JOIN business b ON h.ID_BUSINESS = b.ID JOIN user u ON h.CREATED_BY = u.ID JOIN user_rol ur ON u.ID = ur.USER_ID JOIN rol r ON ur.ROL_ID = r.ID WHERE h.YEAR_STATEMENT = ?", [year]).then((res) => res[0]).catch(error => { undefined });
                                                  
        if (res_business.length == 0) {
            return false;
        }

        conn?.end();
        return { res_business };
    }
    public async getAllStatementByYear2(year: string) {
        const conn = mysqlcon.getConnection();
        const res_business: any = await conn?.execute("SELECT DISTINCT header_statement_form.STATE, header_statement_form.CREATED_BY, header_statement_form.ID_BUSINESS, header_statement_form.UPDATED_AT, header_statement_form.YEAR_STATEMENT, header_statement_form.ID as HEADER_ID, detail_statement_form.*, user.FIRST_NAME, user.LAST_NAME, business.CODE_BUSINESS, business.NAME from header_statement_form inner join business on business.ID = header_statement_form.ID_BUSINESS left join detail_statement_form on detail_statement_form.ID_HEADER = header_statement_form.ID inner join user on user.ID = header_statement_form.CREATED_BY inner join user_rol ON user.ID = user_rol.USER_ID inner join rol ON user_rol.ROL_ID = rol.ID where YEAR_STATEMENT in (?, ?) ORDER BY header_statement_form.ID_BUSINESS ASC", [year, (parseInt(year) - 1)]).then((res) => res[0]).catch(error => { undefined });
    
        if (res_business.length == 0) {
            return false;
        }
    
        conn?.end();
        return { res_business };
    }
    
    public async restApi_save(header: any, detail: any) {
        const { codigo_emp, year } = header;
        if (!codigo_emp || !year) {
            return { 'cod': 'E012', 'descr': `Solo se aceptan antes del año ${new Date().getFullYear()}` };
        }
        if (year >= new Date().getFullYear()) {
            return { 'cod': 'E014', 'descr': `Solo se aceptan antes del año ${new Date().getFullYear()}` };
        }
        const conn = mysqlcon.getConnection();

        const res_business: any = await conn?.execute("SELECT * FROM business WHERE CODE_BUSINESS = ?", [codigo_emp]).then((res) => res[0]).catch(error => { console.log(error); return undefined });
        if (res_business.length == 0) {
            return { 'cod': 'E013', 'descr': 'Empresa no existe' };
        }
        const res_business_user: any = await conn?.execute("SELECT * FROM user_business WHERE ID_USER = ? AND ID_BUSINESS=?", [header.created_by, res_business[0].ID]).then((res) => res[0]).catch(error => { console.log(error); return undefined });
        if (res_business_user.length == 0) {
            return { 'cod': 'E010', 'descr': 'usuario no está asociado a empresa' };
        }
        const res_declaretion: any = await conn?.execute("SELECT * FROM header_statement_form WHERE ID_BUSINESS=? AND YEAR_STATEMENT=?", [res_business[0].ID, year]).then((res) => res[0]).catch(error => { console.log(error); return undefined });
        if (res_declaretion.length > 0) {
            return { 'cod': 'E011', 'descr': 'ya existe declaración envida para este año' };
        }

        const { REC, RET, NREC } = detail;
        let types_A;
        let types_B;
        let types_C;

        if (REC) {
            types_A = Object.keys(REC);
            for (let i = 0; i < types_A.length; i++) {
                const { PNP, PP, ST } = REC[types_A[i]];
                if (PNP) {
                    const value = REC[types_A[i]].PNP;
                    const pattern = /^[0-9]+(,[0-9]+)?$/;
                    if (!pattern.test(value)) {
                        return { response: { 'cod': 'E014', 'descr': 'Error en valores númericos. Revisar formatos' } };
                    }
                }
                if (PP) {
                    const value = REC[types_A[i]].PP;
                    const pattern = /^[0-9]+(,[0-9]+)?$/;
                    if (!pattern.test(value)) {
                        return { response: { 'cod': 'E014', 'descr': 'Error en valores númericos. Revisar formatos' } };
                    }
                }
                if (ST) {
                    const value = REC[types_A[i]].ST;
                    const pattern = /^[0-9]+(,[0-9]+)?$/;
                    if (!pattern.test(value)) {
                        return { response: { 'cod': 'E014', 'descr': 'Error en valores númericos. Revisar formatos' } };
                    }
                }
            }
        }
        if (NREC) {
            types_B = Object.keys(NREC);
            for (let i = 0; i < types_B.length; i++) {
                const { PNP, PP, ST } = NREC[types_B[i]];
                if (PNP) {
                    const value = NREC[types_B[i]].PNP;
                    const pattern = /^[0-9]+(,[0-9]+)?$/;
                    if (!pattern.test(value)) {
                        return { response: { 'cod': 'E014', 'descr': 'Error en valores númericos. Revisar formatos' } };
                    }
                }
                if (PP) {
                    const value = NREC[types_B[i]].PP;
                    const pattern = /^[0-9]+(,[0-9]+)?$/;
                    if (!pattern.test(value)) {
                        return { response: { 'cod': 'E014', 'descr': 'Error en valores númericos. Revisar formatos' } };
                    }
                }
                if (ST) {
                    const value = NREC[types_B[i]].ST;
                    const pattern = /^[0-9]+(,[0-9]+)?$/;
                    if (!pattern.test(value)) {
                        return { response: { 'cod': 'E014', 'descr': 'Error en valores númericos. Revisar formatos' } };
                    }
                }
            }
        }
        if (RET) {
            types_C = Object.keys(RET);
            for (let i = 0; i < types_C.length; i++) {
                const { PNP, PP, ST } = RET[types_C[i]];
                if (PNP) {
                    const value = RET[types_C[i]].PNP;
                    const pattern = /^[0-9]+(,[0-9]+)?$/;
                    if (!pattern.test(value)) {
                        return { response: { 'cod': 'E014', 'descr': 'Error en valores númericos. Revisar formatos' } };
                    }
                }
                if (PP) {
                    const value = RET[types_C[i]].PP;
                    const pattern = /^[0-9]+(,[0-9]+)?$/;
                    if (!pattern.test(value)) {
                        return { response: { 'cod': 'E014', 'descr': 'Error en valores númericos. Revisar formatos' } };
                    }
                }
                if (ST) {
                    const value = RET[types_C[i]].ST;
                    const pattern = /^[0-9]+(,[0-9]+)?$/;
                    if (!pattern.test(value)) {
                        return { response: { 'cod': 'E014', 'descr': 'Error en valores númericos. Revisar formatos' } };
                    }
                }
            }
        }

        const rates: any[] = await ratesDao.ratesID(year);
        let id_header = -1;
        const business = res_business[0].ID;
        const resp: any = await conn?.execute("INSERT INTO header_statement_form(ID_BUSINESS,YEAR_STATEMENT,STATE,CREATED_BY) VALUES (?,?,1,?)", [business, year, header.created_by]).then(res => res[0]).catch(error => { console.log(error) });
        id_header = resp.insertId;

        if (REC) {
            types_A = Object.keys(REC);
            for (let i = 0; i < types_A.length; i++) {
                const type = parseInt(types_A[i]);
                const rate = (rates.find(r => r.type == type))?.price || 0;
                const { PNP, PP, ST } = REC[types_A[i]];
                if (PNP) {
                    const value = parseFloat(REC[types_A[i]].PNP.replace(',', '.'));
                    const amount = rate * value;
                    await conn?.execute("INSERT INTO detail_statement_form(ID_HEADER,PRECEDENCE,HAZARD,RECYCLABILITY,TYPE_RESIDUE,VALUE, AMOUNT) VALUES (?,?,?,?,?,?,?)", [id_header, 1, 2, 1, type, value, amount]).catch(err => console.log(err));
                }
                if (PP) {
                    const value = parseFloat(REC[types_A[i]].PP.replace(',', '.'));
                    const amount = rate * value;
                    await conn?.execute("INSERT INTO detail_statement_form(ID_HEADER,PRECEDENCE,HAZARD,RECYCLABILITY,TYPE_RESIDUE,VALUE, AMOUNT) VALUES (?,?,?,?,?,?,?)", [id_header, 1, 1, 1, type, value, amount]).catch(err => console.log(err));
                }
                if (ST) {
                    const value = parseFloat(REC[types_A[i]].ST.replace(',', '.'));
                    const amount = rate * value;
                    await conn?.execute("INSERT INTO detail_statement_form(ID_HEADER,PRECEDENCE,HAZARD,RECYCLABILITY,TYPE_RESIDUE,VALUE, AMOUNT) VALUES (?,?,?,?,?,?,?)", [id_header, 2, 1, 1, type, value, amount]).catch(err => console.log(err));
                }
            }
        }
        if (NREC) {
            types_B = Object.keys(NREC);
            for (let i = 0; i < types_B.length; i++) {
                const type = parseInt(types_B[i])
                const rate = (rates.find(r => r.type == 4))?.price || 0;
                const { PNP, PP, ST } = NREC[types_B[i]];
                if (PNP) {
                    const value = parseFloat(NREC[types_B[i]].PNP.replace(',', '.'));
                    const amount = rate * value;
                    await conn?.execute("INSERT INTO detail_statement_form(ID_HEADER,PRECEDENCE,HAZARD,RECYCLABILITY,TYPE_RESIDUE,VALUE, AMOUNT) VALUES (?,?,?,?,?,?,?)", [id_header, 1, 2, 2, type, value, amount]).catch(err => console.log(err));
                }
                if (PP) {
                    const value = parseFloat(NREC[types_B[i]].PP.replace(',', '.'));
                    const amount = rate * value;
                    await conn?.execute("INSERT INTO detail_statement_form(ID_HEADER,PRECEDENCE,HAZARD,RECYCLABILITY,TYPE_RESIDUE,VALUE, AMOUNT) VALUES (?,?,?,?,?,?,?)", [id_header, 1, 1, 2, type, value, amount]).catch(err => console.log(err));
                }
                if (ST) {
                    const value = parseFloat(NREC[types_B[i]].ST.replace(',', '.'));
                    const amount = rate * value;
                    await conn?.execute("INSERT INTO detail_statement_form(ID_HEADER,PRECEDENCE,HAZARD,RECYCLABILITY,TYPE_RESIDUE,VALUE, AMOUNT) VALUES (?,?,?,?,?,?,?)", [id_header, 2, 1, 2, type, value, amount]).catch(err => console.log(err));
                }
            }
        }
        if (RET) {
            types_C = Object.keys(RET);
            for (let i = 0; i < types_C.length; i++) {
                const type = parseInt(types_C[i])
                const rate = 0;
                const { PNP, PP, ST } = RET[types_C[i]];
                if (PNP) {
                    const value = parseFloat(RET[types_C[i]].PNP.replace(',', '.'));
                    const amount = rate * value;
                    await conn?.execute("INSERT INTO detail_statement_form(ID_HEADER,PRECEDENCE,HAZARD,RECYCLABILITY,TYPE_RESIDUE,VALUE, AMOUNT) VALUES (?,?,?,?,?,?,?)", [id_header, 1, 2, 3, type, value, amount]).catch(err => console.log(err));
                }
                if (PP) {
                    const value = parseFloat(RET[types_C[i]].PP.replace(',', '.'));
                    const amount = rate * value;
                    await conn?.execute("INSERT INTO detail_statement_form(ID_HEADER,PRECEDENCE,HAZARD,RECYCLABILITY,TYPE_RESIDUE,VALUE, AMOUNT) VALUES (?,?,?,?,?,?,?)", [id_header, 1, 1, 3, type, value, amount]).catch(err => console.log(err));
                }
                if (ST) {
                    const value = parseFloat(RET[types_C[i]].ST.replace(',', '.'));
                    const amount = rate * value;
                    await conn?.execute("INSERT INTO detail_statement_form(ID_HEADER,PRECEDENCE,HAZARD,RECYCLABILITY,TYPE_RESIDUE,VALUE, AMOUNT) VALUES (?,?,?,?,?,?,?)", [id_header, 2, 1, 3, type, value, amount]).catch(err => console.log(err));
                }
            }
        }
        return { 'cod': 'I001', 'descr': 'declaracion ingresada' };

    }
    public async saveDeclaretion(header: any, detail: any[]) {
        const { id_business, year_statement, state, created_by } = header;
        const conn = mysqlcon.getConnection();
        let id_header = 0;
        const res_business: any = await conn?.execute("SELECT * FROM business WHERE CODE_BUSINESS = ?", [id_business]).then((res) => res[0]).catch(error => { console.log(error); return undefined });
        if (res_business.length == 0) {
            return { id_header: -1 };
        }
        const business = res_business[0].ID;
        if (header?.id_statement) {
            id_header = header.id_statement;
        } else {
            const id: any = await conn?.execute("SELECT ID FROM header_statement_form WHERE ID_BUSINESS=? AND YEAR_STATEMENT=?", [business, year_statement]).then(res => res[0]).catch(error => { console.log(error) });
            if (id[0]?.ID > 0) {
                id_header = id[0].ID;
            } else {
                const resp: any = await conn?.execute("INSERT INTO header_statement_form(ID_BUSINESS,YEAR_STATEMENT,STATE,CREATED_BY) VALUES (?,?,?,?)", [business, year_statement, state, created_by]).then(res => res[0]).catch(error => { console.log(error) });
                id_header = resp.insertId;
            }
        }
        if (detail.length > 0) {
            for (let i = 0; i < detail.length; i++) {
                const { precedence, hazard, recyclability, type_residue, value, amount } = detail[i];
                if (detail[i].id) {
                    await conn?.execute("UPDATE detail_statement_form SET VALUE = ? WHERE ID=?", [value, detail[i].id]);
                } else {
                    const tmp: any = await conn?.execute("SELECT ID FROM detail_statement_form WHERE PRECEDENCE=? AND HAZARD=? AND RECYCLABILITY=? AND TYPE_RESIDUE=? AND ID_HEADER=?", [precedence, hazard, recyclability, type_residue, id_header]).then((res) => res[0]).catch(error => undefined);
                    if (tmp.length > 0) {
                        await conn?.execute("UPDATE detail_statement_form SET VALUE = ?, AMOUNT=? WHERE ID=?", [value, amount, tmp[0].ID]);
                    } else {
                        await conn?.execute("INSERT INTO detail_statement_form(ID_HEADER,PRECEDENCE,HAZARD,RECYCLABILITY,TYPE_RESIDUE,VALUE, AMOUNT) VALUES (?,?,?,?,?,?,?)", [id_header, precedence, hazard, recyclability, type_residue, value, amount]).catch(err => console.log(err));
                    }
                    // await conn?.execute("INSERT INTO detail_statement_form(ID_HEADER,PRECEDENCE,HAZARD,RECYCLABILITY,TYPE_RESIDUE,VALUE, AMOUNT) VALUES (?,?,?,?,?,?,?)", [id_header, precedence, hazard, recyclability, type_residue, value, amount]).catch(err => console.log(err));
                }
            }
        }
        conn?.end();
        return { id_header: id_header };
    }
    public async updateValueStatement(id_header: any, detail: any[]) {
        const conn = mysqlcon.getConnection();
        await conn?.execute("UPDATE header_statement_form SET UPDATED_AT=now() WHERE id = ?", [id_header]).then((res) => res[0]).catch(error => undefined);
        for (let i = 0; i < detail.length; i++) {
            const { precedence, hazard, recyclability, type_residue, value, amount } = detail[i];
            if (detail[i].id) {
                await conn?.execute("UPDATE detail_statement_form SET VALUE = ?, AMOUNT=? WHERE ID=?", [value, amount, detail[i].id]);
            } else {
                const tmp: any = await conn?.execute("SELECT ID FROM detail_statement_form WHERE PRECEDENCE=? AND HAZARD=? AND RECYCLABILITY=? AND TYPE_RESIDUE=? AND ID_HEADER=?", [precedence, hazard, recyclability, type_residue, id_header]).then((res) => res[0]).catch(error => undefined);
                if (tmp.length > 0) {
                    await conn?.execute("UPDATE detail_statement_form SET VALUE = ?, AMOUNT=? WHERE ID=?", [value, amount, tmp[0].ID]);
                } else {
                    await conn?.execute("INSERT INTO detail_statement_form(ID_HEADER,PRECEDENCE,HAZARD,RECYCLABILITY,TYPE_RESIDUE,VALUE, AMOUNT) VALUES (?,?,?,?,?,?,?)", [id_header, precedence, hazard, recyclability, type_residue, value, amount]).catch(err => console.log(err));
                }
            }
        }
        conn?.end();
        return;
    }
    public async changeStateHeader(state: boolean | number, id: number) {
        const conn = mysqlcon.getConnection();
        const tmp0:any=await conn?.execute("select VALIDATED_AT FROM header_statement_form WHERE id = ? AND VALIDATED_AT IS not NULL", [id]).then((res) => res[0]).catch(error => undefined);
        if(tmp0.length > 0) {
            const tmp = await conn?.execute("UPDATE header_statement_form SET STATE = ?, UPDATED_AT= ? WHERE id = ?", [state,tmp0[0].VALIDATED_AT, id]).then((res) => res[0]).catch(error => undefined);
            conn?.end();
            if (tmp == undefined) {
                return false;
            }
            return true;
        }
        const tmp = await conn?.execute("UPDATE header_statement_form SET STATE = ?, UPDATED_AT=now() WHERE id = ?", [state, id]).then((res) => res[0]).catch(error => undefined);
        if (tmp == undefined) {
            return false;
        }
        conn?.end();
        return true;
    }
    public async validateStatement(id: number) {
        const conn = mysqlcon.getConnection();
        let error;
        const tmp:any = await conn?.execute("UPDATE header_statement_form SET STATE = ?, UPDATED_AT=now(), VALIDATED_AT=now() WHERE id = ?", [2, id]).then((res) => res[0]).catch(err=> { error=err; return undefined});
        if (tmp == undefined || tmp.affectedRows == 0) {
            return error||'Declaración no encontrada';
        }
        conn?.end();
        return true;
    }
    public async saveOC(id: number, file: any,) {
        const conn = mysqlcon.getConnection();
        const file_name = file.name;
        let error:any = undefined;
        await conn?.execute("UPDATE header_statement_form SET FILE_NAME=?, FILE_OC=? WHERE id=?", [file_name, file.data, id]).then((res) => res[0]).catch(err => { error = err; console.log(err); return [{ undefined }] });
        conn?.end()
        if (error == undefined) {
            return true;
        }
        return error;
    }
    public async findOC(id: number) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("SELECT FILE_OC FROM header_statement_form WHERE ID=?", [id]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        if (res.length == 0){
            return false
        }
        return res[0].FILE_OC
    }
    public async haveDraft(business: string, year: string) {
        const conn = mysqlcon.getConnection();
        const _res: any = await conn?.execute("SELECT ID, STATE FROM header_statement_form WHERE ID_BUSINESS=(SELECT ID FROM business WHERE CODE_BUSINESS=?) AND YEAR_STATEMENT=? AND STATE in (1, 2) ORDER BY ID DESC LIMIT 1", [business, year]).then((res) => res[0]).catch(error => undefined);
        let isOk = false;
        if (_res != null && _res != undefined && _res.length > 0) {
            isOk = true;
            conn?.end();
            return {isOk, _res};
        } else {
            conn?.end();
            return {isOk, _res};
        }
    }
    public async haveDJ(business: string, id: any) {
        const conn = mysqlcon.getConnection();
        const res: any = await conn?.execute("SELECT user_business.ID_USER, user_business.ID_BUSINESS, user_business.DJ_FILE, business.CODE_BUSINESS FROM user_business JOIN business ON user_business.ID_BUSINESS = business.ID WHERE CODE_BUSINESS = ? AND ID_USER = ? AND DJ_FILE IS NOT NULL; ", [business, id]).then((res) => res[0]).catch(error => undefined);
        conn?.end();
        return res;
    }
    public async businessUserDJ(id: any) {
        const conn = mysqlcon.getConnection();
        const res: any = await conn?.execute("SELECT user_business.ID_USER, user_business.ID_BUSINESS, user_business.DJ_FILE, business.CODE_BUSINESS, business.NAME FROM user_business JOIN business ON user_business.ID_BUSINESS = business.ID WHERE ID_USER = ?;", [id]).then((res) => res[0]).catch(error => undefined);
        conn?.end();
        return res;
    }
    public async deleteDJ(business: string, id: any) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("UPDATE user_business SET DJ_FILE = NULL WHERE ID_USER = ? AND ID_BUSINESS = ?", [id, business]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res;
    }
    public async getDetailById(id: any, year: any) {
        const conn = mysqlcon.getConnection();
        const table0 = await conn?.execute("SELECT SUM(VALUE) as VALUE, TYPE_RESIDUE, RECYCLABILITY, header_statement_form.STATE FROM detail_statement_form INNER JOIN header_statement_form ON header_statement_form.ID = detail_statement_form.ID_HEADER WHERE ID_BUSINESS = (SELECT ID FROM business WHERE CODE_BUSINESS=?) AND YEAR_STATEMENT=? GROUP BY TYPE_RESIDUE, RECYCLABILITY", [id, year]).then((res) => res[0]).catch(error => { undefined });
        conn?.end();
        return table0;
    }
    public async getDetailByIdHeader(id_header: any) {
        const conn = mysqlcon.getConnection();
        const table0 = await conn?.execute("SELECT * FROM detail_statement_form WHERE ID_HEADER = ?", [id_header]).then((res) => res[0]).catch(error => { undefined });
        conn?.end();
        return table0;
    }
}
const statementDao = new statementProductorDao();
export default statementDao;