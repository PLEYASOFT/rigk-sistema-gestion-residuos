import mysqlcon from '../db';

class EstablishmentDao {
    async addEstablishment(NAME_ESTABLISHMENT: string, REGION: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("INSERT INTO establishment(NAME_ESTABLISHMENT,REGION) VALUES (?,?)", [NAME_ESTABLISHMENT, REGION]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res
    }

    public async getAllEstablishment() {
        const conn = mysqlcon.getConnection()!;
        const establishment: any = await conn.query("SELECT * FROM establishment").then(res => res[0]).catch(erro => undefined);
        if (establishment == null || establishment.length == 0) {
            return false;
        }
        conn.end();
        return establishment;
    }

    public async deleteEstablishment(ID: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("DELETE FROM establishment WHERE id = ?", [ID]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res
    }
}

const establishmentDao = new EstablishmentDao();
export default establishmentDao;