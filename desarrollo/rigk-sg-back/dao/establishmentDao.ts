import mysqlcon from '../db';
class EstablishmentDao {
    async addEstablishment(NAME_ESTABLISHMENT: string, REGION: string, ID_BUSINESS: number) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("INSERT INTO establishment(NAME_ESTABLISHMENT,REGION) VALUES (?,?)", [NAME_ESTABLISHMENT, REGION]).then((res) => res[0]).catch(error => [{ undefined }]);
        const establishmentId = res.insertId; // Obtener el ID del nuevo establecimiento insertado
        // Insertar una nueva fila en la tabla establishment_business
        await conn.query("INSERT INTO establishment_business(ID_ESTABLISHMENT, ID_BUSINESS ) VALUES (?,?)", [establishmentId, ID_BUSINESS]).then((res) => res[0]).catch(error => [{ undefined }]);
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
        return res;
    }

    public async getDeclarationEstablishment(ID: any) {
        const conn = mysqlcon.getConnection()!;
        await conn.execute("SET lc_time_names = 'es_ES';");
        const data: any = await conn.execute(`SELECT establishment.NAME_ESTABLISHMENT, header_industrial_consumer_form.CREATED_AT, header_industrial_consumer_form.YEAR_STATEMENT,
            header_industrial_consumer_form.ID AS ID_HEADER, business.NAME as NAME_BUSINESS,detail_industrial_consumer_form.ID AS ID_DETAIL,
            CASE
                   WHEN EXISTS (SELECT 1
                                FROM attached_industrial_consumer_form
                                WHERE attached_industrial_consumer_form.ID_DETAIL = detail_industrial_consumer_form.ID)
                   THEN 1
                   ELSE 0
               END AS semaforo,
            CASE detail_industrial_consumer_form.PRECEDENCE
                WHEN 0 THEN 'Papel/Cartón'
                WHEN 1 THEN 'Metal'
                WHEN 2 THEN 'Plástico Total'
                WHEN 3 THEN 'Madera'
                ELSE 'Desconocido'
            END AS PRECEDENCE,
            CASE detail_industrial_consumer_form.TYPE_RESIDUE
                WHEN 1 THEN 'Papel'
                WHEN 2 THEN 'Papel Compuesto (cemento)'
                WHEN 3 THEN 'Caja Cartón'
                WHEN 4 THEN 'Papel/Cartón Otro'
                WHEN 5 THEN 'Envase Aluminio'
                WHEN 6 THEN 'Malla o Reja (IBC)'
                WHEN 7 THEN 'Envase Hojalata'
                WHEN 8 THEN 'Metal Otro'
                WHEN 9 THEN 'Plástico Film Embalaje'
                WHEN 10 THEN 'Plástico Envases Rígidos (Incl. Tapas)'
                WHEN 11 THEN 'Plástico Sacos o Maxisacos'
                WHEN 12 THEN 'Plástico EPS (Poliestireno Expandido)'
                WHEN 13 THEN 'Plástico Zuncho'
                WHEN 14 THEN 'Plástico Otro'
                WHEN 15 THEN 'Caja de Madera'
                WHEN 16 THEN 'Pallet de Madera'
                ELSE 'Desconocido'
            END AS TYPE_RESIDUE,
            detail_industrial_consumer_form.VALUE,
            detail_industrial_consumer_form.DATE_WITHDRAW AS FechaRetiro,
            CONCAT(UPPER(SUBSTRING(DATE_FORMAT(detail_industrial_consumer_form.DATE_WITHDRAW, '%M-%Y'), 1, 1)), SUBSTRING(DATE_FORMAT(detail_industrial_consumer_form.DATE_WITHDRAW, '%M-%Y'), 2)) AS FechaRetiroTipeada,
            detail_industrial_consumer_form.ID_GESTOR AS IdGestor,
            detail_industrial_consumer_form.LER,
            CASE detail_industrial_consumer_form.TREATMENT_TYPE
                WHEN 1 THEN 'Reciclaje Mecánico'
                WHEN 2 THEN 'Valorización Energética'
                WHEN 3 THEN 'Disposición Final en RS'
            ELSE 'Desconocido'
            END AS TipoTratamiento
    FROM header_industrial_consumer_form
    INNER JOIN establishment ON establishment.ID = header_industrial_consumer_form.ID_ESTABLISHMENT
    INNER JOIN establishment_business ON establishment_business.ID_ESTABLISHMENT = establishment.ID
    INNER JOIN business ON business.ID = establishment_business.ID_BUSINESS
    INNER JOIN detail_industrial_consumer_form ON detail_industrial_consumer_form.ID_HEADER = header_industrial_consumer_form.ID
    WHERE establishment_business.ID_ESTABLISHMENT IN (SELECT ID_ESTABLISHMENT FROM establishment_business WHERE ID_BUSINESS IN (SELECT ID_BUSINESS FROM user_business WHERE ID_USER = ?))
 `, [ID]).then(res => res[0]).catch(erro => { console.log(erro); return undefined });

        conn.end();
        return data;
    }

    public async getEstablishmentByID(ID: any) {
        const conn = mysqlcon.getConnection()!;
        const establishment: any = await conn.query("SELECT * FROM establishment WHERE establishment.ID = ?", [ID]).then((res) => res[0]).catch(error => [{ undefined }]);
        if (establishment == null || establishment.length == 0) {
            return false;
        }
        conn.end();
        return establishment;
    }
}
const establishmentDao = new EstablishmentDao();
export default establishmentDao;