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
        const data: any = await conn.execute(`
            SELECT CONCAT(establishment.NAME_ESTABLISHMENT, ' - ', establishment.REGION) AS NAME_ESTABLISHMENT_REGION,
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
                CASE detail_industrial_consumer_form.PRECEDENCE
                    WHEN 1 THEN 'Papel/Cartón'
                    WHEN 2 THEN 'Metal'
                    WHEN 3 THEN 'Plástico'
                    WHEN 4 THEN 'Madera'
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
                header_industrial_consumer_form.STATE_GESTOR,
                invoices_detail.VALUE AS VALUE_DECLARATE,
                detail_industrial_consumer_form.DATE_WITHDRAW AS FechaRetiro,
                CONCAT(UPPER(SUBSTRING(DATE_FORMAT(detail_industrial_consumer_form.DATE_WITHDRAW, '%M-%Y'), 1, 1)), SUBSTRING(DATE_FORMAT(detail_industrial_consumer_form.DATE_WITHDRAW, '%M-%Y'), 2)) AS FechaRetiroTipeada,
                detail_industrial_consumer_form.ID_GESTOR AS IdGestor,
                detail_industrial_consumer_form.LER,
                detail_industrial_consumer_form.TREATMENT_TYPE AS TREATMENT_TYPE_NUMBER,
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
        LEFT JOIN invoices_detail ON invoices_detail.ID_DETAIL = detail_industrial_consumer_form.ID
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
    public async getInvoice(number:any, rut:any,treatment_type:number,material_type:number) {
        const conn = mysqlcon.getConnection()!;
        const business: any = await conn.execute("SELECT NAME FROM business WHERE VAT = ? LIMIT 1", [rut]).then((res) => res[0]).catch(error => {console.log(error);return [{undefined}]});
        console.log(business);
        if (business == null || business.length == 0) {
            return []
        }
        // const data: any = await conn.execute("SELECT ID, VALUED_TOTAL AS invoice_value FROM invoices WHERE INVOICE_NUMBER=? AND VAT=?", [number,rut]).then((res) => res[0]).catch(error => [{ undefined }]);
        const data: any = await conn.execute("SELECT ID, VALUED_TOTAL AS invoice_value FROM invoices WHERE INVOICE_NUMBER=? AND VAT=? AND TREATMENT_TYPE=? AND MATERIAL_TYPE=?", [number,rut,treatment_type, material_type]).then((res) => res[0]).catch(error => [{ undefined }]);
        console.log(data)
        if (data == null || data.length == 0) {
            return [{
                invoice_value: null,
                num_asoc: 0,
                value_declarated: 0,
                NAME: business[0].NAME || null
            }];
        }
        const ID_INVOICE = data[0].ID;
        // const data2: any = await conn.execute("SELECT SUM(VALUE) AS value_declarated, COUNT(VALUE) as num_asoc FROM invoices_detail WHERE ID_INVOICE=? AND TREATMENT_TYPE=? AND MATERIAL_TYPE=?", [ID_INVOICE,treatment_type, material_type]).then((res) => res[0]).catch(error => [{ undefined }]);
        const data2: any = await conn.execute("SELECT SUM(VALUE) AS value_declarated, COUNT(VALUE) as num_asoc FROM invoices_detail WHERE ID_INVOICE=?", [ID_INVOICE]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return [{
            invoice_value: data[0].invoice_value,
            num_asoc: data2[0].num_asoc || 0,
            value_declarated: data2[0].value_declarated || 0,
            NAME: business[0].NAME || null
        }];
    }
    public async saveInvoice(vat:any,invoice_number:any,id_detail:any,date_pr:any,value:any,file:any, valued_total:any,id_user:any, treatment:any,material:any) {
        const file_name = file.name;
        const _file = file.data;
        const conn = mysqlcon.getConnection()!;
        const invoice: any = await conn.execute("SELECT ID FROM invoices WHERE INVOICE_NUMBER=? AND VAT=?", [invoice_number,vat]).then((res) => res[0]).catch(error => [{ undefined }]);
        let ID = invoice[0].ID;
        console.log(invoice);
        if(invoice.length == 0) {
            const _ID:any = await conn.execute("INSERT INTO invoices(INVOICE_NUMBER,VAT,VALUED_TOTAL,ID_USER) VALUES(?,?,?,?)", [invoice_number,vat, valued_total,id_user]).then((res) => res[0]).catch(error => [{ undefined }]);
            ID = _ID.insertId;
        }
        console.log(ID)
        await conn.execute("INSERT INTO invoices_detail(ID_INVOICE,ID_DETAIL,TREATMENT_TYPE,MATERIAL_TYPE,VALUE,FILE,FILE_NAME,DATE_PR) VALUES(?,?,?,?,?,?,?,?)", [ID,id_detail, treatment,material,value,_file,file_name,date_pr]).then((res) => res[0]).catch(error => {console.log(error)});
        conn.end();
        return [{ID}];
    }

}
const establishmentDao = new EstablishmentDao();
export default establishmentDao;