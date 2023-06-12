import mysqlcon from '../db';
class BusinessDao {
    public async checkID(user: string, id: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("SELECT * FROM user_business WHERE ID_USER = ? AND ID_BUSINESS = (SELECT ID FROM business WHERE CODE_BUSINESS=?)", [user, id]).then(res => res[0]).catch(erro => undefined);
        let resp = false;
        if ((res != null && res != undefined) && res.length > 0) {
            resp = true;
        }
        conn.end();
        return { resp, id2: res[0]?.ID_BUSINESS };
    }
    public async getBusiness(id: string) {
        const conn = mysqlcon.getConnection()!;
        const business: any = await conn.query("SELECT ID, NAME, VAT, LOC_ADDRESS, PHONE, EMAIL, AM_FIRST_NAME, AM_LAST_NAME, INVOICE_NAME, INVOICE_EMAIL, INVOICE_PHONE, CODE_BUSINESS, GIRO FROM business WHERE CODE_BUSINESS = ?", [id]).then(res => res[0]).catch(erro => undefined);
        if (business == null || business.length == 0) {
            return false;
        }
        conn.end();
        return business;
    }
    public async getBusinessByUser(id: string) {
        const conn = mysqlcon.getConnection()!;
        const business: any = await conn.query("SELECT business.ID, business.NAME FROM business INNER JOIN user_business ON user_business.ID_BUSINESS = business.ID WHERE user_business.ID_USER = ?", [id]).then(res => res[0]).catch(erro => undefined);
        if (business == null || business.length == 0) {
            return false;
        }
        conn.end();
        return business;
    }
    public async getBusinessByVAT(vat: string) {
        const conn = mysqlcon.getConnection()!;
        const business: any = await conn.query("SELECT business.ID, business.NAME FROM business WHERE business.VAT = ?", [vat]).then(res => res[0]).catch(erro => undefined);
        if (business == null || business.length == 0) {
            return false;
        }
        conn.end();
        return business;
    }
    public async checkEstablishmentBusinessRelation(establishmentId: number, businessId: number, specificType: number) {
        const conn = mysqlcon.getConnection()!;
        const _region: any = await conn.query("SELECT REGION FROM establishment WHERE ID = ?", [establishmentId]).then(res => res[0]).catch(error => undefined);
        const relation: any = await conn.query("SELECT manager.* FROM manager INNER JOIN manager_business ON manager_business.ID_MANAGER = manager.ID WHERE manager.COD_MATERIAL = ? AND manager.REGION = ? AND manager_business.ID_BUSINESS=?", [specificType, _region[0].REGION, businessId]);
        conn.end();

        if (!Array.isArray(relation) || relation.length === 0) {
            return false;
        }
        return true;
    }
    public async getAllBusiness() {
        const conn = mysqlcon.getConnection()!;
        const business: any = await conn.query("SELECT * FROM business").then(res => res[0]).catch(erro => undefined);
        if (business == null || business.length == 0) {
            return false;
        }
        conn.end();
        return business;
    }
    public async postBusiness(NAME: string, VAT: string, LOC_ADDRESS: string, PHONE: string, EMAIL: string, AM_FIRST_NAME: string, AM_LAST_NAME: string, INVOICE_NAME: string, INVOICE_EMAIL: string, INVOICE_PHONE: string, CODE_BUSINESS: string, GIRO: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("INSERT INTO business(NAME, VAT, LOC_ADDRESS, PHONE, EMAIL,AM_FIRST_NAME,AM_LAST_NAME,INVOICE_NAME,INVOICE_EMAIL,INVOICE_PHONE,CODE_BUSINESS,GIRO) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [NAME, VAT, LOC_ADDRESS, PHONE, EMAIL, AM_FIRST_NAME, AM_LAST_NAME, INVOICE_NAME, INVOICE_EMAIL, INVOICE_PHONE, CODE_BUSINESS, GIRO]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res;
    }
    public async deleteBusiness(ID: string) {
        const conn = mysqlcon.getConnection()!;
        await conn.query("DELETE FROM establishment_business WHERE ID_BUSINESS=?", [ID]).then((res) => res[0]).catch(error => [{ undefined }]);
        await conn.query("DELETE FROM user_business WHERE ID_BUSINESS=?", [ID]).then((res) => res[0]).catch(error => [{ undefined }]);
        const res: any = await conn.query("DELETE FROM business WHERE id = ?", [ID]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res;
    }
    public async updateBusiness(ID: string, NAME: string, VAT: string, LOC_ADDRESS: string, PHONE: string, EMAIL: string, AM_FIRST_NAME: string, AM_LAST_NAME: string, INVOICE_NAME: string, INVOICE_EMAIL: string, INVOICE_PHONE: string, CODE_BUSINESS: string, GIRO: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("UPDATE business SET NAME = ?, VAT = ?, LOC_ADDRESS = ?, PHONE = ?, EMAIL = ?, AM_FIRST_NAME = ?, AM_LAST_NAME = ?, INVOICE_NAME = ?, INVOICE_EMAIL = ?, INVOICE_PHONE = ?, CODE_BUSINESS=?, GIRO =? WHERE ID = ?", [NAME, VAT, LOC_ADDRESS, PHONE, EMAIL, AM_FIRST_NAME, AM_LAST_NAME, INVOICE_NAME, INVOICE_EMAIL, INVOICE_PHONE, CODE_BUSINESS, GIRO, ID]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res;
    }
    public async getAllBusinessById(id: string, year: string) {
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
const businessDao = new BusinessDao();
export default businessDao;
