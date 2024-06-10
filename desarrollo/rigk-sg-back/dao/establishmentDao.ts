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

    public async getDeclarationEstablishmentByIdGestor(ID_GESTORs: any[]) {
        const conn = mysqlcon.getConnection()!;
        await conn.execute("SET lc_time_names = 'es_ES';");
        const query = `
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
        type_treatment.NAME AS TipoTratamiento,
        gestor.NAME AS NAME_GESTOR
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
    LEFT JOIN business AS gestor ON gestor.ID = detail_industrial_consumer_form.ID_GESTOR
    WHERE detail_industrial_consumer_form.ID_GESTOR IN (?)`;
        const data: any = await conn.query(query, [ID_GESTORs]).then(res => res[0]).catch(erro => { console.log(erro); return undefined });
        conn.end();
        return data;
    }
    

    public async getAllDeclarationEstablishments() {
        const conn = mysqlcon.getConnection()!;
        await conn.execute("SET lc_time_names = 'es_ES';");
        const data: any = await conn.execute(`
        SELECT 
        CONCAT(establishment.NAME_ESTABLISHMENT, ' - ', communes.NAME, ' - ', establishment.REGION ) AS NAME_ESTABLISHMENT_REGION,
        header_industrial_consumer_form.CREATED_AT, 
        header_industrial_consumer_form.YEAR_STATEMENT,
        header_industrial_consumer_form.ID AS ID_HEADER, 
        business.NAME as NAME_BUSINESS, 
        detail_industrial_consumer_form.ID AS ID_DETAIL,
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
        CONCAT(UPPER(SUBSTRING(DATE_FORMAT(detail_industrial_consumer_form.DATE_WITHDRAW, '%M-%Y'), 1, 1)), 
               SUBSTRING(DATE_FORMAT(detail_industrial_consumer_form.DATE_WITHDRAW, '%M-%Y'), 2)) AS FechaRetiroTipeada,
        detail_industrial_consumer_form.ID_GESTOR AS IdGestor,
        detail_industrial_consumer_form.LER,
        detail_industrial_consumer_form.TREATMENT_TYPE AS TREATMENT_TYPE_NUMBER,
        type_treatment.NAME AS TipoTratamiento,
        CASE
            WHEN aicf.ID IS NULL THEN 0
            ELSE 1
        END AS HAS_MV
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
    LEFT JOIN attached_industrial_consumer_form aicf ON aicf.ID_DETAIL = detail_industrial_consumer_form.ID    
        `).then(res => res[0]).catch(erro => { console.log(erro); return undefined });
        conn.end();
        return data;
    }

    public async getBusinessByRolConsumidor() {
        const conn = mysqlcon.getConnection();

        const res_business: any = await conn?.execute(`SELECT DISTINCT business.ID, business.NAME, business.VAT, business.CODE_BUSINESS
        FROM business
        JOIN user_business ON business.ID = user_business.ID_BUSINESS
        JOIN user ON user_business.ID_USER = user.ID
        JOIN user_rol ON user.ID = user_rol.USER_ID
        JOIN rol ON user_rol.ROL_ID = rol.ID
        WHERE rol.NAME = 'Consumidor' AND user.STATE = '1';`).then((res) => res[0]).catch(error => { undefined });

        if (res_business.length == 0) {
            return false;
        }
        conn?.end();
        return { res_business };
    }

    public async getDeclarationEstablishmentExcelCI(YEAR: any) {
        const conn = mysqlcon.getConnection()!;
        await conn.execute("SET lc_time_names = 'es_ES';");
        const data: any = await conn.execute(`
            SELECT DISTINCT 
            business_created_by.CODE_BUSINESS AS ID_EMPRESA,
            business_created_by.VAT AS RUT_EMPRESA,
            business_created_by.NAME AS NOMBRE,
            establishment.NAME_ESTABLISHMENT AS ESTABLECIMIENTO,
            establishment.ID_VU AS ID_VU,
            regions.NAME AS REGION,
            communes.NAME AS COMUNA,
            header_industrial_consumer_form.YEAR_STATEMENT as ANO_DECLARACION, 
            CASE detail_industrial_consumer_form.STATE_GESTOR
                WHEN 0 THEN 'PENDIENTE'
                WHEN 1 THEN 'APROBADO'
            END AS ESTADO_DECLARACION,
            type_material.MATERIAL AS SUBCATEGORIA,
            type_treatment.NAME AS TRATAMIENTO,
            submaterial.SUBMATERIAL AS SUBTIPO,
            detail_industrial_consumer_form.VALUE AS PESO_DECLARADO,
            invoices_detail.VALUE AS PESO_VALORIZADO,
            detail_industrial_consumer_form.DATE_WITHDRAW AS FECHA_DE_RETIRO,
            detail_industrial_consumer_form.ID_GESTOR AS ID_GESTOR,
            business_assignated_to.NAME AS GESTOR,
            business_assignated_to.VAT AS RUT_GESTOR,
            concat(user_created_by.FIRST_NAME , " " , user_created_by.LAST_NAME) AS USUARIO	
        
        FROM header_industrial_consumer_form
        
        JOIN establishment ON establishment.ID = header_industrial_consumer_form.ID_ESTABLISHMENT
        JOIN establishment_business ON establishment_business.ID_ESTABLISHMENT = establishment.ID
        JOIN business AS business_created_by ON business_created_by.ID = establishment_business.ID_BUSINESS
        
        JOIN detail_industrial_consumer_form ON detail_industrial_consumer_form.ID_HEADER = header_industrial_consumer_form.ID
        
        LEFT JOIN business AS business_assignated_to ON business_assignated_to.ID = detail_industrial_consumer_form.ID_GESTOR
        
        JOIN communes ON communes.ID = establishment.ID_COMUNA
        JOIN regions ON regions.ID = establishment.ID_REGION
        
        JOIN user_business ON business_created_by.ID = user_business.ID_BUSINESS
        JOIN user AS user_created_by ON user_created_by.ID = header_industrial_consumer_form.CREATED_BY
        JOIN user AS user_assigned ON user_assigned.ID = user_business.ID_USER
        JOIN user_rol ON user_assigned.ID = user_rol.USER_ID
        JOIN rol ON user_rol.ROL_ID = rol.ID
        
        LEFT JOIN invoices_detail ON invoices_detail.ID_DETAIL = detail_industrial_consumer_form.ID
        LEFT JOIN type_material ON type_material.ID = detail_industrial_consumer_form.PRECEDENCE
        LEFT JOIN submaterial ON submaterial.ID = detail_industrial_consumer_form.TYPE_RESIDUE
        LEFT JOIN type_treatment ON type_treatment.ID = detail_industrial_consumer_form.TREATMENT_TYPE
        
        WHERE user_assigned.STATE = '1' AND header_industrial_consumer_form.YEAR_STATEMENT = ?
     `, [YEAR]).then(res => res[0]).catch(erro => { console.log(erro); return undefined });
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
            const results: any = await conn.query(query, [id_vu, region, name, comuna]);
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

    public async getInvoice(number: any, idGestor: number) {
        const conn = mysqlcon.getConnection()!;
        const data0: any = await conn.execute(
            `SELECT invoices.ID, invoices.VALUED_TOTAL AS invoice_value, invoices.TREATMENT_TYPE, invoices.MATERIAL_TYPE, invoices.ID_BUSINESS, invoices.VAT
             FROM invoices
             JOIN invoices_detail ON invoices.ID = invoices_detail.ID_INVOICE
             JOIN detail_industrial_consumer_form ON invoices_detail.ID_DETAIL = detail_industrial_consumer_form.ID
             WHERE invoices.INVOICE_NUMBER = ? AND detail_industrial_consumer_form.ID_GESTOR = ?`,
            [number, idGestor]
        ).then((res) => res[0]).catch(error => [{ undefined }]);

        if (data0 == null || data0.length == 0) {
            return [{
                invoice_value: null,
                num_asoc: 0,
                value_declarated: 0,
                NAME: '',
                RUT: ''
            }];
        }
        
        const ID_INVOICE = data0[0].ID;
        let businessName = ''; 
        let vat = ''; 
        
        if (!isNaN(data0[0]['ID_BUSINESS'])) {
            const business: any = await conn.execute("SELECT NAME FROM business WHERE ID = ?", [data0[0]['ID_BUSINESS']]).then((res) => res[0]).catch(error => { console.log(error); return [{ undefined }] });
            if (business != null && business.length > 0) {
                businessName = business[0].NAME; 
                vat = data0[0]['VAT']; 
            } else {
                businessName = data0[0]['ID_BUSINESS'].toString();
                vat = data0[0]['VAT'];  
            }
        } else {
            businessName = data0[0]['ID_BUSINESS']; 
            vat = data0[0]['VAT'];  
        }
        const data2: any = await conn.execute("SELECT SUM(VALUE) AS value_declarated, COUNT(VALUE) as num_asoc FROM invoices_detail WHERE ID_INVOICE=?", [ID_INVOICE]).then((res) => res[0]).catch(error => console.log(error));
        conn.end();
        return [{
            invoice_value: data0[0].invoice_value,
            num_asoc: data2[0].num_asoc || 0,
            value_declarated: data2[0].value_declarated || 0,
            NAME: businessName,
            RUT: vat
        }];
    }

    public async saveInvoice(vat: any, id_business: any, invoice_number: any, id_detail: any, date_pr: any, value: any, file: any, valued_total: any, id_user: any, treatment: any, material: any, IdGestor: any) {
        const file_name = file.name;
        const _file = file.data;
        const conn = mysqlcon.getConnection()!;
        try {
            const invoice: any = await conn.execute(`SELECT invoices.ID, invoices.VALUED_TOTAL AS invoice_value, invoices.TREATMENT_TYPE, invoices.MATERIAL_TYPE, invoices.ID_BUSINESS, invoices.VAT
            FROM invoices
            JOIN invoices_detail ON invoices.ID = invoices_detail.ID_INVOICE
            JOIN detail_industrial_consumer_form ON invoices_detail.ID_DETAIL = detail_industrial_consumer_form.ID
            WHERE invoices.INVOICE_NUMBER = ? AND detail_industrial_consumer_form.ID_GESTOR = ?`, [invoice_number,IdGestor]).then((res) => res[0]).catch(error => [{ undefined }]);
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