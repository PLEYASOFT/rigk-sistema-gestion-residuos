import mysqlcon from '../db';

class EstablishmentDao {
    async addEstablishment(NAME_ESTABLISHMENT: string, REGION: string, ID_BUSINESS: number) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("INSERT INTO establishment(NAME_ESTABLISHMENT,REGION) VALUES (?,?)", [NAME_ESTABLISHMENT, REGION]).then((res) => res[0]).catch(error => [{ undefined }]);

        const establishmentId = res.insertId; // Obtener el ID del nuevo establecimiento insertado

        // Insertar una nueva fila en la tabla establishment_business
        const res2: any = await conn.query("INSERT INTO establishment_business(ID_ESTABLISHMENT, ID_BUSINESS ) VALUES (?,?)", [establishmentId, ID_BUSINESS]).then((res) => res[0]).catch(error => [{ undefined }]);

        conn.end();
        return res;
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

    public async getEstablishment(ID: any) {
        const conn = mysqlcon.getConnection()!;
        const establishment: any = await conn.query("SELECT establishment.NAME_ESTABLISHMENT, establishment.REGION, establishment_business.ID_BUSINESS,establishment_business.ID_ESTABLISHMENT FROM establishment_business INNER JOIN establishment ON establishment.ID = establishment_business.ID_ESTABLISHMENT WHERE establishment_business.ID_BUSINESS=?", [ID]).then((res) => res[0]).catch(error => [{ undefined }]);
        if (establishment == null || establishment.length == 0) {
            return false;
        }
        conn.end();
        return establishment;
    }

    public async deleteEstablishment(ID: any) {
        const conn = mysqlcon.getConnection()!;
        await conn.query("DELETE FROM establishment_business WHERE ID_ESTABLISHMENT = ?", [ID]).then((res) => res[0]).catch(error => [{ undefined }]);
        const res: any = await conn.query("DELETE FROM establishment WHERE ID=?", [ID]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res
    }

    public async getDeclarationEstablishment(ID:any) {
        const conn = mysqlcon.getConnection()!;
        const data: any = await conn.execute(`SELECT establishment.NAME_ESTABLISHMENT, header_industrial_consumer_form.CREATED_AT, header_industrial_consumer_form.YEAR_STATEMENT,
                                                header_industrial_consumer_form.ID AS ID_HEADER, business.NAME as NAME_BUSINESS FROM header_industrial_consumer_form
                                                INNER JOIN establishment ON establishment.ID = header_industrial_consumer_form.ID_ESTABLISHMENT
                                                INNER JOIN establishment_business ON establishment_business.ID_ESTABLISHMENT = establishment.ID
                                                INNER JOIN business ON business.ID = establishment_business.ID_BUSINESS WHERE establishment_business.ID_ESTABLISHMENT IN (SELECT ID_ESTABLISHMENT FROM establishment_business WHERE ID_BUSINESS IN (SELECT ID_BUSINESS FROM user_business WHERE ID_USER = ?))`,[ID]).then(res => res[0]).catch(erro => {console.log(erro);return undefined});

        for (let i = 0; i < data.length; i++) {
            const element = data[i];

            const detail: any = await conn.execute("SELECT VALUE FROM detail_industrial_consumer_form WHERE ID_HEADER=? AND ID not IN (SELECT ID_DETAIL FROM attached_industrial_consumer_form)", [element.ID_HEADER]).then((res) => res[0]).catch(error => [{ undefined }]);
            if (detail.length > 0) {
                // pintar en rojo
                element.semaforo = false;
            } else {
                // pintar en verde
                element.semaforo = true;
            }
        }
        conn.end();
        return data
    }
}

const establishmentDao = new EstablishmentDao();
export default establishmentDao;