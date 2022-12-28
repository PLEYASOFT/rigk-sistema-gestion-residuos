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

        console.log("Es ... " + business.length);

        if (business == null || business.length == 0) {
            return false;
        }

        conn.end();
        return business;
    }

    public async getAllBusiness() {
        const conn = mysqlcon.getConnection()!;
        const business: any = await conn.query("SELECT * FROM business").then(res => res[0]).catch(erro => undefined);

        console.log("Es ... " + business.length);

        if (business == null || business.length == 0) {
            return false;
        }

        conn.end();
        return business;
    }
}

const businessDao = new BusinessDao();
export default businessDao;
