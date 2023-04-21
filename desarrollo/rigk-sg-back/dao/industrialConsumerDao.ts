import mysqlcon from '../db';
class IndustrialConsumerDao {
    public async saveForm(header: any, detail: any[], attached: any) {
        const conn = mysqlcon.getConnection()!;
        const resp_header: any = await conn.execute("INSERT INTO header_industrial_consumer_form(ID_ESTABLISHMENT,CREATED_BY,YEAR_STATEMENT) VALUES(?,?,?)", [header.establishment, header.created_by, header.year]).then((res) => res[0]).catch(error => [{ undefined }]);
        const id_header = resp_header.insertId;
        for (let i = 0; i < detail.length; i++) {
            const { table, residue, val, date_withdraw, id_gestor } = detail[i];
            const resp: any = await conn?.execute("INSERT INTO detail_industrial_consumer_form(ID_HEADER,PRECEDENCE,TYPE_RESIDUE,VALUE, DATE_WITHDRAW,ID_GESTOR) VALUES (?,?,?,?,?,?)", [id_header, table, residue, val, date_withdraw, id_gestor]).then((res) => res[0]).catch(error => [{ undefined }]);
            const id_detail = resp.insertId;

            for (var key in attached) {
                const _table = key.split("_")[1];
                const _residue = key.split("_")[2];
                const _type = key.split("_")[3];
                if (_residue == residue && _table == table) {
                    const file_name = attached[key].name;
                    await conn.execute("INSERT INTO attached_industrial_consumer_form(ID_DETAIL, FILE_NAME, FILE, TYPE_FILE) VALUES (?,?,?,?)", [id_detail, file_name, attached[key].data, _type]).then((res) => res[0]).catch(error => { console.log(error); return [{ undefined }] });
                }
            }
        }
        conn.end();
        return id_header;
    }
    public async saveFile(idEstablishment: number, createdBy: number, yearStatement: number, idHeader: number, precedence: number, typeResidue: number, value: number,
        dateWithdraw: string, idGestor: number, idDetail: number, fileName: string, fileBuffer: File, typeFile: number) {
        const conn = mysqlcon.getConnection()!;
        const resp_header: any = await conn.execute("INSERT INTO header_industrial_consumer_form(ID_ESTABLISHMENT,CREATED_BY,YEAR_STATEMENT) VALUES(?,?,?)", [idEstablishment, createdBy, yearStatement]).then((res) => res[0]).catch(error => [{ undefined }]);
        const id_header = resp_header.insertId;
        const resp: any = await conn?.execute("INSERT INTO detail_industrial_consumer_form(ID_HEADER,PRECEDENCE,TYPE_RESIDUE,VALUE, DATE_WITHDRAW,ID_GESTOR) VALUES (?,?,?,?,?,?)", [id_header, precedence, typeResidue, value, dateWithdraw, idGestor]).then((res) => res[0]).catch(error => [{ undefined }]);
        const id_detail = resp.insertId;
        const attached: any = await conn.execute("INSERT INTO attached_industrial_consumer_form(ID_DETAIL, FILE_NAME, FILE, TYPE_FILE) VALUES (?,?,?,?)", [id_detail, fileName, fileBuffer, typeFile]).then((res) => res[0]).catch(error => { console.log(error); return [{ undefined }] });
        conn.end();
        return { header: resp_header, resp, attached };
    }
    public async getForm(id_header: any) {
        const conn = mysqlcon.getConnection()!;
        const header: any = await conn.execute("SELECT header_industrial_consumer_form.*,establishment.NAME_ESTABLISHMENT  FROM header_industrial_consumer_form INNER JOIN establishment on establishment.ID = header_industrial_consumer_form.ID_ESTABLISHMENT WHERE header_industrial_consumer_form.ID=? ", [id_header]).then((res) => res[0]).catch(error => [{ undefined }]);
        const detail: any = await conn.execute("SELECT * FROM detail_industrial_consumer_form WHERE ID_HEADER=? ", [id_header]).then((res) => res[0]).catch(error => [{ undefined }]);
        const attached: any = await conn.execute("SELECT attached_industrial_consumer_form.*, detail_industrial_consumer_form.PRECEDENCE, detail_industrial_consumer_form.TYPE_RESIDUE FROM attached_industrial_consumer_form INNER JOIN detail_industrial_consumer_form ON detail_industrial_consumer_form.ID = attached_industrial_consumer_form.ID_DETAIL  WHERE ID_DETAIL IN (SELECT ID FROM detail_industrial_consumer_form WHERE ID_HEADER=?) ", [id_header]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return { header: header[0], detail, attached };
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
}
const industrialConsumerDao = new IndustrialConsumerDao();
export default industrialConsumerDao;