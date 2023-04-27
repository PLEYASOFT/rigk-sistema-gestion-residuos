import mysqlcon from '../db';
class IndustrialConsumerDao {
    public async saveForm(header: any, detail: any[], attached: any) {
        const conn = mysqlcon.getConnection()!;
        const resp_header: any = await conn.execute("INSERT INTO header_industrial_consumer_form(ID_ESTABLISHMENT,CREATED_BY,YEAR_STATEMENT) VALUES(?,?,?)", [header.establishment, header.created_by, header.year]).then((res) => res[0]).catch(error => [{ undefined }]);
        const id_header = resp_header.insertId;
        for (let i = 0; i < detail.length; i++) {
            const { residue, sub, value, date, gestor, ler, treatment } = detail[i];
            const resp: any = await conn?.execute("INSERT INTO detail_industrial_consumer_form(ID_HEADER,PRECEDENCE,TYPE_RESIDUE,VALUE, DATE_WITHDRAW,ID_GESTOR, LER,TREATMENT_TYPE) VALUES (?,?,?,?,?,?,?,?)", [id_header, residue, sub, value, date, gestor, (ler || null), treatment]).then((res) => res[0]).catch(error => [{ undefined }]);
            const id_detail = resp.insertId;

            for (var key in attached) {
                const _sub = key.split("_")[1];
                const _treatment = key.split("_")[2];
                const _type = key.split("_")[3];
                if (_sub == sub && _treatment == treatment) {
                    const file_name = attached[key].name;
                    await conn.execute("INSERT INTO attached_industrial_consumer_form(ID_DETAIL, FILE_NAME, FILE, TYPE_FILE) VALUES (?,?,?,?)", [id_detail, file_name, attached[key].data, _type]).then((res) => res[0]).catch(error => { console.log(error); return [{ undefined }] });
                }
            }
        }
        conn.end();
        return id_header;
    }
    public async saveFile(idDetail: number, fileName: string, fileBuffer: File, typeFile: number) {
        const conn = mysqlcon.getConnection()!;
        const attached: any = await conn.execute("INSERT INTO attached_industrial_consumer_form(ID_DETAIL, FILE_NAME, FILE, TYPE_FILE) VALUES (?,?,?,?)", [idDetail, fileName, fileBuffer, typeFile]).then((res) => res[0]).catch(error => { console.log(error); return [{ undefined }] });
        conn.end();
        return { attached };
    }
    public async saveHeaderData(establishmentId: any, createdBy: any, createdAt: Date, yearStatement: any) {
        const conn = mysqlcon.getConnection()!;
        const header: any = await conn.execute("INSERT INTO header_industrial_consumer_form(ID_ESTABLISHMENT, CREATED_BY, CREATED_AT, UPDATED_AT, YEAR_STATEMENT) VALUES (?,?,?,?,?)", [establishmentId, createdBy, createdAt, createdAt, yearStatement])
            .then((res) => res[0])
            .catch((error) => {
                console.log(error);
                return [{ undefined }];
            });
        conn.end();
        return { header };
    }
    public async saveDetailData(ID_HEADER: any, PRECEDENCE: any, TYPE_RESIDUE: any, VALUE: any, DATE_WITHDRAW: any, ID_GESTOR: any, LER: any, TREATMENT_TYPE: any) {
        const conn = mysqlcon.getConnection()!;
        const detail: any = await conn.execute("INSERT INTO detail_industrial_consumer_form(ID_HEADER, PRECEDENCE, TYPE_RESIDUE, VALUE, DATE_WITHDRAW, ID_GESTOR, LER, TREATMENT_TYPE) VALUES (?,?,?,?,?,?,?,?)", [ID_HEADER, PRECEDENCE, TYPE_RESIDUE, VALUE, DATE_WITHDRAW, ID_GESTOR, LER, TREATMENT_TYPE])
            .then((res) => res[0])
            .catch((error) => {
                console.log(error);
                return [{ undefined }];
            });
        conn.end();
        return { detail };
    }
    public async getForm(id_header: any) {
        const conn = mysqlcon.getConnection()!;
        const header: any = await conn.execute("SELECT header_industrial_consumer_form.*,establishment.NAME_ESTABLISHMENT  FROM header_industrial_consumer_form INNER JOIN establishment on establishment.ID = header_industrial_consumer_form.ID_ESTABLISHMENT WHERE header_industrial_consumer_form.ID=? ", [id_header]).then((res) => res[0]).catch(error => [{ undefined }]);
        const detail: any = await conn.execute("SELECT * FROM detail_industrial_consumer_form WHERE ID_HEADER=? ", [id_header]).then((res) => res[0]).catch(error => [{ undefined }]);
        const attached: any = await conn.execute("SELECT attached_industrial_consumer_form.*, detail_industrial_consumer_form.PRECEDENCE, detail_industrial_consumer_form.TYPE_RESIDUE FROM attached_industrial_consumer_form INNER JOIN detail_industrial_consumer_form ON detail_industrial_consumer_form.ID = attached_industrial_consumer_form.ID_DETAIL  WHERE ID_DETAIL IN (SELECT ID FROM detail_industrial_consumer_form WHERE ID_HEADER=?) ", [id_header]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return { header: header[0], detail, attached };
    }

    public async getMV(id_detail: any) {
        const conn = mysqlcon.getConnection()!;
        const header: any = await conn.execute(`
            SELECT
                attached_industrial_consumer_form.ID,
                attached_industrial_consumer_form.FILE_NAME,
                attached_industrial_consumer_form.TYPE_FILE,
                CASE attached_industrial_consumer_form.TYPE_FILE
                    WHEN 1 THEN 'Guia de despacho'
                    WHEN 2 THEN 'Factura gestor'
                    WHEN 3 THEN 'Registro de peso'
                    WHEN 4 THEN 'Fotografía Retiro'
                    WHEN 5 THEN 'Otro'
                    ELSE 'Desconocido'
                END AS TYPE_FILE_TIPEADO
            FROM
                attached_industrial_consumer_form
            WHERE
                attached_industrial_consumer_form.ID_DETAIL = ?`, [id_detail]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return { header };
    }
    public async deleteById(id: number) {
        const conn = mysqlcon.getConnection()!;
        const result: any = await conn.execute("DELETE FROM attached_industrial_consumer_form WHERE ID = ?", [id]).then((res) => res[0]).catch(error => { console.log(error); return [{ undefined }] });
        conn.end();
        return result;
    }
    public async getFormConsulta(id_header: any) {
        const conn = mysqlcon.getConnection()!;
        const header: any = await conn.execute(`SELECT
        b.NAME AS 'NombreEmpresa',
        b.ID AS 'IDEmpresa',
        b.CODE_BUSINESS AS 'CodigoEmpresa',
        e.NAME_ESTABLISHMENT AS 'Establecimiento',
        e.ID AS 'IDEstablecimiento',
        e.REGION AS 'Region'
    FROM
        header_industrial_consumer_form h
        JOIN establishment e ON h.ID_ESTABLISHMENT = e.ID
        JOIN establishment_business eb ON e.ID = eb.ID_ESTABLISHMENT
        JOIN business b ON eb.ID_BUSINESS = b.ID
    WHERE
        h.ID = ?;
        `, [id_header]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return { header: header };
    }
    public async verify(year: any, business: any) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn?.execute("SELECT ID FROM header_industrial_consumer_form WHERE ID_ESTABLISHMENT IN (SELECT ID FROM establishment_business WHERE ID_BUSINESS = (SELECT ID FROM business WHERE CODE_BUSINESS=?)) AND YEAR_STATEMENT=? LIMIT 1", [business, year]).then((res) => res[0]).catch(error => undefined);
        let isOk = false;
        if (res != null && res != undefined && res.length > 0) {
            isOk = true;
            conn?.end();
            return isOk;
        } else {
            conn?.end();
            return isOk;
        }
    }

    public async getDeclarationByID(ID_HEADER: any, ID_DETAIL: any) {
        const conn = mysqlcon.getConnection()!;
        await conn.execute("SET lc_time_names = 'es_ES';");
        const data: any = await conn.execute(`SELECT establishment.NAME_ESTABLISHMENT, header_industrial_consumer_form.CREATED_AT, header_industrial_consumer_form.CREATED_BY, header_industrial_consumer_form.YEAR_STATEMENT,
        header_industrial_consumer_form.ID AS ID_HEADER, business.NAME as NAME_BUSINESS, detail_industrial_consumer_form.ID AS ID_DETAIL,
        detail_industrial_consumer_form.PRECEDENCE AS PRECEDENCE,
        CASE detail_industrial_consumer_form.PRECEDENCE
            WHEN 0 THEN 'Papel/Cartón'
            WHEN 1 THEN 'Metal'
            WHEN 2 THEN 'Plástico Total'
            WHEN 3 THEN 'Madera'
            ELSE 'Desconocido'
        END AS PRECEDENCETIPEADO,
        detail_industrial_consumer_form.TYPE_RESIDUE AS TYPE_RESIDUE,
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
        END AS TYPE_RESIDUE_TIPEADO,
        detail_industrial_consumer_form.VALUE,
        detail_industrial_consumer_form.DATE_WITHDRAW AS FechaRetiro,
        CONCAT(UPPER(SUBSTRING(DATE_FORMAT(detail_industrial_consumer_form.DATE_WITHDRAW, '%M-%Y'), 1, 1)), SUBSTRING(DATE_FORMAT(detail_industrial_consumer_form.DATE_WITHDRAW, '%M-%Y'), 2)) AS FechaRetiroTipeada,
        detail_industrial_consumer_form.ID_GESTOR AS IdGestor,
        gestor.NAME AS NombreGestor,
        IFNULL(detail_industrial_consumer_form.LER, '-') AS LER,
        detail_industrial_consumer_form.TREATMENT_TYPE AS TREATMENT_TYPE,
        CASE detail_industrial_consumer_form.TREATMENT_TYPE
            WHEN 1 THEN 'Reciclaje Mecánico'
            WHEN 2 THEN 'Valorización Energética'
            WHEN 3 THEN 'Disposición Final en RS'
        ELSE 'Desconocido'
        END AS TIPO_TRATAMIENTO_TIPEADO
    FROM header_industrial_consumer_form
    INNER JOIN establishment ON establishment.ID = header_industrial_consumer_form.ID_ESTABLISHMENT
    INNER JOIN establishment_business ON establishment_business.ID_ESTABLISHMENT = establishment.ID
    INNER JOIN business ON business.ID = establishment_business.ID_BUSINESS
    INNER JOIN detail_industrial_consumer_form ON detail_industrial_consumer_form.ID_HEADER = header_industrial_consumer_form.ID
    INNER JOIN business AS gestor ON detail_industrial_consumer_form.ID_GESTOR = gestor.ID
    WHERE header_industrial_consumer_form.ID = ? AND detail_industrial_consumer_form.ID = ?
`, [ID_HEADER, ID_DETAIL]).then(res => res[0]).catch(erro => { console.log(erro); return undefined });

        conn.end();
        return data;
    }

    public async downloadFile(id: any) {
        const conn = mysqlcon.getConnection()!;
        const fileData: any = await conn.query("SELECT ID, FILE_NAME, FILE, TYPE_FILE FROM attached_industrial_consumer_form WHERE ID=?", [id]).then((res) => res[0]).catch(error => [{ undefined }]);

        if (fileData == null || fileData.length == 0) {
            return null;
        }

        conn.end();
        return {
            fileName: fileData[0].FILE_NAME,
            fileType: fileData[0].TYPE_FILE,
            fileContent: fileData[0].FILE
        };
    }
}
const industrialConsumerDao = new IndustrialConsumerDao();
export default industrialConsumerDao;