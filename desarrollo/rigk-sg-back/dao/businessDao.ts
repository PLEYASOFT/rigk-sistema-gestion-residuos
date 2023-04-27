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
        console.log(business)
        if (business == null || business.length == 0) {
            return false;
        }
        conn.end();
        return business;
    }
    public async checkEstablishmentBusinessRelation(establishmentId: number, businessId: number) {
        const conn = mysqlcon.getConnection()!;
        const relation = await conn.query("SELECT * FROM establishment_business WHERE ID_ESTABLISHMENT = ? AND ID_BUSINESS = ?", [establishmentId, businessId]).then(res => res[0]).catch(error => undefined);
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
}
const businessDao = new BusinessDao();
export default businessDao;
