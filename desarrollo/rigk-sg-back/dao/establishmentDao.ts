import mysqlcon from '../db';
class EstablishmentDao {
    async addEstablishment(NAME_ESTABLISHMENT: string, REGION: string, ID_VU: string, ID_REGION: number, ID_COMUNA: number, ADDRESS: string, ID_BUSINESS: number) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("INSERT INTO establishment(NAME_ESTABLISHMENT,REGION,ID_VU,ID_REGION,ID_COMUNA,ADDRESS) VALUES (?,?,?,?,?,?)", [NAME_ESTABLISHMENT, REGION, ID_VU, ID_REGION, ID_COMUNA, ADDRESS]).then((res) => res[0]).catch(error => [{ undefined }]);
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
        const establishment: any = await conn.query("SELECT communes.NAME as NAME_COMMUNE, establishment.NAME_ESTABLISHMENT, establishment.REGION, establishment.ADDRESS, establishment.ID_COMUNA, establishment.ID_VU, establishment_business.ID_BUSINESS,establishment_business.ID_ESTABLISHMENT FROM establishment_business INNER JOIN establishment ON establishment.ID = establishment_business.ID_ESTABLISHMENT JOIN communes ON establishment.ID_COMUNA = communes.ID WHERE establishment_business.ID_BUSINESS=?", [ID]).then((res) => res[0]).catch(error => [{ undefined }]);
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
        const data: any = await conn.execute(`
            SELECT CONCAT(establishment.NAME_ESTABLISHMENT, ' - ', communes.NAME, ' - ', establishment.REGION ) AS NAME_ESTABLISHMENT_REGION,
                header_industrial_consumer_form.CREATED_AT, header_industrial_consumer_form.YEAR_STATEMENT,
                header_industrial_consumer_form.ID AS ID_HEADER, business.NAME as NAME_BUSINESS, detail_industrial_consumer_form.ID AS ID_DETAIL,
                CASE
                WHEN detail_industrial_consumer_form.PRECEDENCE = 4 THEN 1
                WHEN EXISTS (SELECT 1
                            FROM attached_industrial_consumer_form
                            WHERE attached_industrial_consumer_form.ID_DETAIL = detail_industrial_consumer_form.ID)
                THEN 1
                ELSE 0
            END AS semaforo,
            detail_industrial_consumer_form.PRECEDENCE AS PRECEDENCE_NUMBER,
            type_material.MATERIAL AS PRECEDENCE,
            submaterial.SUBMATERIAL AS TYPE_RESIDUE,
            detail_industrial_consumer_form.VALUE,
            detail_industrial_consumer_form.STATE_GESTOR,
            invoices_detail.VALUE AS VALUE_DECLARATE,
            detail_industrial_consumer_form.DATE_WITHDRAW AS FechaRetiro,
            CONCAT(UPPER(SUBSTRING(DATE_FORMAT(detail_industrial_consumer_form.DATE_WITHDRAW, '%M-%Y'), 1, 1)), SUBSTRING(DATE_FORMAT(detail_industrial_consumer_form.DATE_WITHDRAW, '%M-%Y'), 2)) AS FechaRetiroTipeada,
            detail_industrial_consumer_form.ID_GESTOR AS IdGestor,
            detail_industrial_consumer_form.LER,
            detail_industrial_consumer_form.TREATMENT_TYPE AS TREATMENT_TYPE_NUMBER,
            type_treatment.NAME AS TipoTratamiento
        FROM header_industrial_consumer_form
        INNER JOIN establishment ON establishment.ID = header_industrial_consumer_form.ID_ESTABLISHMENT
        INNER JOIN establishment_business ON establishment_business.ID_ESTABLISHMENT = establishment.ID
        INNER JOIN business ON business.ID = establishment_business.ID_BUSINESS
        INNER JOIN detail_industrial_consumer_form ON detail_industrial_consumer_form.ID_HEADER = header_industrial_consumer_form.ID
        INNER JOIN communes ON communes.ID = establishment.ID_COMUNA
        LEFT JOIN invoices_detail ON invoices_detail.ID_DETAIL = detail_industrial_consumer_form.ID
        LEFT JOIN type_material ON type_material.ID = detail_industrial_consumer_form.PRECEDENCE
        LEFT JOIN submaterial ON submaterial.ID = detail_industrial_consumer_form.TYPE_RESIDUE
        LEFT JOIN type_treatment ON type_treatment.ID = detail_industrial_consumer_form.TREATMENT_TYPE
        WHERE establishment_business.ID_ESTABLISHMENT IN (SELECT ID_ESTABLISHMENT FROM establishment_business WHERE ID_BUSINESS IN (SELECT ID_BUSINESS FROM user_business WHERE ID_USER = ?))
     `, [ID]).then(res => res[0]).catch(erro => { console.log(erro); return undefined });
        conn.end();
        return data;
    }
    

    public async getEstablishmentByID(ID: any) {
        const conn = mysqlcon.getConnection()!;
        const establishment: any = await conn.query(
            "SELECT establishment.*, communes.NAME AS COMUNA_NAME FROM establishment " +
            "LEFT JOIN communes ON establishment.ID_COMUNA = communes.ID " +
            "WHERE establishment.ID = ?", 
            [ID]
        ).then((res) => res[0]).catch(error => [{ undefined }]);
        
        if (establishment == null || establishment.length == 0) {
            return false;
        }
        
        conn.end();
        return establishment;
    }

    public async getIdByEstablishment(id_vu: any, region: any, comuna: any, name: any) {
        const conn = mysqlcon.getConnection()!;
        const query = `
            SELECT e.ID
            FROM establishment e
            INNER JOIN communes c ON e.ID_COMUNA = c.ID
            WHERE e.ID_VU = ?
            AND e.REGION = ?
            AND e.NAME_ESTABLISHMENT = ?
            AND c.NAME = ?`;
    
        try {
            const results:any = await conn.query(query, [id_vu, region, name, comuna]);
            conn.end();
            if (results.length > 0) {
                return results[0];
            }
            return false;
        } catch (error) {
            console.error(error);
            conn.end();
            return false;
        }
    }    
    
    public async getInvoice(number: any, rut: any, treatment_type: number, material_type: number) {
        const conn = mysqlcon.getConnection()!;
        const business: any = await conn.execute("SELECT ID, NAME FROM business WHERE VAT = ?", [rut]).then((res) => res[0]).catch(error => { console.log(error); return [{ undefined }] });
        if (business == null || business.length == 0) {
            return []
        }
        const data0:any = await conn.execute("SELECT ID, VALUED_TOTAL AS invoice_value,TREATMENT_TYPE,MATERIAL_TYPE FROM invoices WHERE INVOICE_NUMBER=? AND VAT=?", [number, rut]).then((res) => res[0]).catch(error => [{ undefined }]);
        // first invoice
        if (data0 == null || data0.length == 0) {
            return [{
                invoice_value: null,
                num_asoc: 0,
                value_declarated: 0,
                NAME: business
            }];
        }
        
        //verify constraint
        if(data0[0]['MATERIAL_TYPE'] != material_type || data0[0]['TREATMENT_TYPE'] != treatment_type) {
            return [];
        }
        //get invoice
        const ID_INVOICE = data0[0].ID;
        const data2: any = await conn.execute("SELECT SUM(VALUE) AS value_declarated, COUNT(VALUE) as num_asoc FROM invoices_detail WHERE ID_INVOICE=?", [ID_INVOICE]).then((res) => res[0]).catch(error => console.log(error));
        conn.end();
        return [{
            invoice_value: data0[0].invoice_value,
            num_asoc: data2[0].num_asoc || 0,
            value_declarated: data2[0].value_declarated || 0,
            NAME: business
        }];
    }
    
    public async saveInvoice(vat: any, id_business: any, invoice_number: any, id_detail: any, date_pr: any, value: any, file: any, valued_total: any, id_user: any, treatment: any, material: any) {
        const file_name = file.name;
        const _file = file.data;
        const conn = mysqlcon.getConnection()!;
        try {
            const invoice: any = await conn.execute("SELECT ID FROM invoices WHERE INVOICE_NUMBER=? AND VAT=?", [invoice_number, vat]).then((res) => res[0]).catch(error => [{ undefined }]);
            let ID;
            if (invoice.length == 0) {
                const _ID: any = await conn.execute("INSERT INTO invoices(INVOICE_NUMBER,VAT,VALUED_TOTAL,ID_USER,TREATMENT_TYPE,MATERIAL_TYPE,ID_BUSINESS) VALUES(?,?,?,?,?,?,?)", [invoice_number, vat, valued_total, id_user, treatment, material, id_business]).then((res) => res[0]).catch(error => [{ undefined }]);
                ID = _ID.insertId;
            } else {
                ID = invoice[0].ID;
            }
            await conn.execute("INSERT INTO invoices_detail(ID_INVOICE,ID_DETAIL,VALUE,FILE,FILE_NAME,DATE_PR) VALUES(?,?,?,?,?,?)", [ID, id_detail, value, _file, file_name, date_pr]).then((res) => res[0]).catch(error => { console.log(error) });
            await conn.execute("UPDATE detail_industrial_consumer_form SET STATE_GESTOR=1 WHERE ID = ?", [id_detail]).then((res) => res[0]).catch(error => [{ undefined }]);
            conn.end();
            return [{ ID }];
        } catch (error) {
            throw error;
        }
    }
}
const establishmentDao = new EstablishmentDao();
export default establishmentDao;