import mysqlcon from '../db';
class EstablishmentDao {
    async getDashboard() {
        const conn = mysqlcon.getEtlConnection()!;
        const res: any = await conn.query(`SELECT tbm_anios.ANIO, (tbh_porc_cump_ci.VALOR_CUM * 100) AS percentage, tbh_porc_cump_ci.VALOR_TON_VAL as value, tbm_materiales.TYPE_MATERIAL
        FROM tbh_porc_cump_ci
        JOIN tbd_cum_anio ON tbh_porc_cump_ci.ID = tbd_cum_anio.ID_CUMP
        JOIN tbd_cum_materiales ON tbh_porc_cump_ci.ID = tbd_cum_materiales.ID_CUMP
        JOIN tbm_anios ON tbd_cum_anio.ID_ANIO = tbm_anios.ID
        JOIN tbm_materiales ON tbd_cum_materiales.ID_MATERIAL = tbm_materiales.ID
        ORDER BY tbm_anios.ANIO, tbm_materiales.TYPE_MATERIAL
        `).then(res => res[0]).catch(erro => undefined);
        conn.end();
        return res;
    }
}
const establishmentDao = new EstablishmentDao();
export default establishmentDao;