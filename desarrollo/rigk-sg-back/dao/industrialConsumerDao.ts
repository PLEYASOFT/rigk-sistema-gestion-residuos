import mysqlcon from '../db';

class IndustrialConsumerDao {

    public async saveForm(header:any, detail: any[], attached: any) {
        const { Blob } = require("buffer");
        
        const conn = mysqlcon.getConnection()!;
        const resp_header:any = await conn.execute("INSERT INTO header_industrial_consumer_form(ID_ESTABLISHMENT,CREATED_BY,YEAR_STATEMENT) VALUES(?,?,?)",[header.establishment, header.created_by,header.year]).then((res) => res[0]).catch(error => [{ undefined }]);
        const id_header = resp_header.insertId;
        for (let i = 0; i < detail.length; i++) {
            const {table, residue, val, date_withdraw, id_gestor} = detail[i];
            const resp:any = await conn?.execute("INSERT INTO detail_industrial_consumer_form(ID_HEADER,PRECEDENCE,TYPE_RESIDUE,VALUE, DATE_WITHDRAW,ID_GESTOR) VALUES (?,?,?,?,?,?)", [id_header, table, residue, val,date_withdraw, id_gestor]).then((res) => res[0]).catch(error => [{ undefined }]);
            const id_detail = resp.insertId;

            for (var key in attached) {
                const _table = key.split("_")[1];
                const _residue = key.split("_")[2];
                const _type = key.split("_")[3];
                console.log(_table,_residue,_type,"=>",table,residue);
                if(_residue == residue && _table == table) {
                    // TO CHECK
                    const blob = new Blob(attached[key].data);
                    const file_name = attached[key].name;
                    await conn.execute("INSERT INTO attached_industrial_consumer_form(ID_DETAIL, FILE_NAME, FILE, TYPE_FILE) VALUES (?,?,?,?)", [id_detail,file_name,attached[key],_type]).then((res) => res[0]).catch(error => {console.log(error); return [{ undefined }]});
                }
            }
        }
        conn.end();
        return id_header;
    }
    public async getForm(id_header: any) {
        const conn = mysqlcon.getConnection()!;
        const header:any = await conn.execute("SELECT header_industrial_consumer_form.*,establishment.NAME_ESTABLISHMENT  FROM header_industrial_consumer_form INNER JOIN establishment on establishment.ID = header_industrial_consumer_form.ID_ESTABLISHMENT WHERE header_industrial_consumer_form.ID=? ",[id_header]).then((res) => res[0]).catch(error => [{ undefined }]);
        const detail:any = await conn.execute("SELECT * FROM detail_industrial_consumer_form WHERE ID_HEADER=? ",[id_header]).then((res) => res[0]).catch(error => [{ undefined }]);
        const attached:any = await conn.execute("SELECT * FROM attached_industrial_consumer_form WHERE ID_DETAIL IN (SELECT ID FROM detail_industrial_consumer_form WHERE ID_HEADER=?) ",[id_header]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return {header:header[0],detail,attached};
    }
}

const industrialConsumerDao = new IndustrialConsumerDao();
export default industrialConsumerDao;