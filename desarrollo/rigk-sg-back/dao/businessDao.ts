import mysqlcon from '../db';

class BusinessDao {

    public async checkID(user: string, id: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("SELECT * FROM user_business WHERE ID_USER = ? AND ID_BUSINESS = ?", [user, id]).then(res => res[0]).catch(erro => undefined);

        let isOk = false;
        if ((res != null && res != undefined) && res.length > 0) {
            isOk = true;
        }
        conn.end();
        return isOk;
    }

    public async getBusiness(id: string) {
        const conn = mysqlcon.getConnection()!;
        const business: any = await conn.query("SELECT ID, NAME, VAT, LOC_ADDRESS, PHONE, EMAIL, AM_FIRST_NAME, AM_LAST_NAME, INVOICE_NAME, INVOICE_EMAIL, INVOICE_PHONE FROM business WHERE ID = ?", [id]).then(res => res[0]).catch(erro => undefined);
        if (business == null || business.length == 0) {
            return false;
        }

        conn.end();
        return business;
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

    public async postBusiness(NAME: string, VAT: string, LOC_ADDRESS: string, PHONE: string, EMAIL: string,AM_FIRST_NAME: string, AM_LAST_NAME: string, INVOICE_NAME: string, INVOICE_EMAIL: string, INVOICE_PHONE: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("INSERT INTO business(NAME, VAT, LOC_ADDRESS, PHONE, EMAIL,AM_FIRST_NAME,AM_LAST_NAME,INVOICE_NAME,INVOICE_EMAIL,INVOICE_PHONE) VALUES (?,?,?,?,?,?,?,?,?,?)", [NAME, VAT, LOC_ADDRESS, PHONE, EMAIL,AM_FIRST_NAME,AM_LAST_NAME,INVOICE_NAME,INVOICE_EMAIL,INVOICE_PHONE]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res
    }

    public async deleteBusiness(ID: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("DELETE FROM business WHERE id = ?", [ID]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        console.log(res)
        return res
    }

    public async updateBusiness(ID: string, NAME: string, VAT: string, LOC_ADDRESS: string, PHONE: string, EMAIL: string,AM_FIRST_NAME: string, AM_LAST_NAME: string, INVOICE_NAME: string, INVOICE_EMAIL: string, INVOICE_PHONE: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("UPDATE business SET NAME = ?, VAT = ?, LOC_ADDRESS = ?, PHONE = ?, EMAIL = ?, AM_FIRST_NAME = ?, AM_LAST_NAME = ?, INVOICE_NAME = ?, INVOICE_EMAIL = ?, INVOICE_PHONE = ? WHERE ID = ?", [NAME, VAT, LOC_ADDRESS, PHONE, EMAIL,AM_FIRST_NAME,AM_LAST_NAME,INVOICE_NAME,INVOICE_EMAIL,INVOICE_PHONE, ID]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res
        }
}

const businessDao = new BusinessDao();
export default businessDao;
