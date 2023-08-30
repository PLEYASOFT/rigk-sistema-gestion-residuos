import mysqlcon from '../db';
class EstablishmentDao {
    async getDashboard() {
        const conn = mysqlcon.getEtlConnection()!;
        const res: any = await conn.query(`SELECT tbm_anios.ANIO, (tbh_porc_cump_ci.VALOR_CUM * 100) AS percentage, tbm_meses.MESES_ABREV, tbh_porc_cump_ci.VALOR_TON_VAL as value, tbm_materiales.TYPE_MATERIAL
        FROM tbh_porc_cump_ci
        JOIN tbd_cum_anio ON tbh_porc_cump_ci.ID = tbd_cum_anio.ID_CUMP
        JOIN tbd_cum_materiales ON tbh_porc_cump_ci.ID = tbd_cum_materiales.ID_CUMP
        JOIN tbm_anios ON tbd_cum_anio.ID_ANIO = tbm_anios.ID
        JOIN tbm_materiales ON tbd_cum_materiales.ID_MATERIAL = tbm_materiales.ID
        JOIN tbd_cum_meses ON tbh_porc_cump_ci.ID = tbd_cum_meses.ID_CUMP
        JOIN tbm_meses ON tbd_cum_meses.ID_MES = tbm_meses.ID
        ORDER BY tbm_anios.ANIO, tbm_materiales.TYPE_MATERIAL, tbm_meses.ID
        `).then(res => res[0]).catch(erro => undefined);
        conn.end();
        return res;
    }

    async getSemesterDashboard() {
        const conn = mysqlcon.getEtlConnection()!;
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;

        let semester2Month = currentMonth > 6 ? currentMonth : 0;

        const currentYear = currentDate.getFullYear();

        const res: any = await conn.query(`
            SELECT 
                COALESCE(tbm_materiales.TYPE_MATERIAL, 'Total') as name,
                CASE 
                    WHEN tbm_meses.ID = 6 THEN 'Semestre 1'
                    WHEN tbm_meses.ID = ? THEN 'Semestre 2'
                END AS semester,
                tbh_porc_cump_ci.VALOR_TON_VAL as value,
                tbm_anios.ANIO as year
            FROM tbh_porc_cump_ci
            JOIN tbd_cum_anio ON tbh_porc_cump_ci.ID = tbd_cum_anio.ID_CUMP
            JOIN tbd_cum_materiales ON tbh_porc_cump_ci.ID = tbd_cum_materiales.ID_CUMP
            JOIN tbm_anios ON tbd_cum_anio.ID_ANIO = tbm_anios.ID
            LEFT JOIN tbm_materiales ON tbd_cum_materiales.ID_MATERIAL = tbm_materiales.ID
            JOIN tbd_cum_meses ON tbh_porc_cump_ci.ID = tbd_cum_meses.ID_CUMP
            JOIN tbm_meses ON tbd_cum_meses.ID_MES = tbm_meses.ID
            WHERE tbm_anios.ANIO >= 2022 AND tbm_anios.ANIO <= ? AND tbm_meses.ID IN (6, ?)
            ORDER BY tbm_anios.ANIO, tbm_materiales.TYPE_MATERIAL, tbm_meses.ID
        `, [semester2Month, currentYear, semester2Month]).then(res => res[0]).catch(error => undefined);

        conn.end();

        const resultMapping: any = {};

        for (const row of res) {
            const key = `${row.name}-${row.year}`;
            if (!resultMapping[key]) {
                resultMapping[key] = {
                    name: row.name,
                    year: row.year,
                    series: [{ name: 'Semestre 1', value: 0.0 }, { name: 'Semestre 2', value: 0.0 }]
                };
            }
            const currentValue = parseFloat(row.value);
            if (row.semester === 'Semestre 1') {
                resultMapping[key].series[0].value = parseFloat(currentValue.toFixed(2));
            } else {
                const sem2Value = parseFloat((currentValue - resultMapping[key].series[0].value).toFixed(2));
                resultMapping[key].series[1].value = sem2Value;
            }
        }

        return Object.values(resultMapping);
    }


    async getYearlyMaterialWeights() {
        const conn = mysqlcon.getEtlConnection()!;
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        const [previousYearsData]: any = await conn.query(`
        SELECT 
            tbm_anios.ANIO as year,
            tbm_materiales.TYPE_MATERIAL as material,
            SUM(tbh_porc_cump_ci.VALOR_TON_VAL) as value
        FROM tbh_porc_cump_ci
        JOIN tbd_cum_anio ON tbh_porc_cump_ci.ID = tbd_cum_anio.ID_CUMP
        JOIN tbd_cum_materiales ON tbh_porc_cump_ci.ID = tbd_cum_materiales.ID_CUMP
        JOIN tbm_anios ON tbd_cum_anio.ID_ANIO = tbm_anios.ID
        JOIN tbm_materiales ON tbd_cum_materiales.ID_MATERIAL = tbm_materiales.ID
        JOIN tbd_cum_meses ON tbh_porc_cump_ci.ID = tbd_cum_meses.ID_CUMP
        WHERE tbm_anios.ANIO >= 2022 AND tbm_anios.ANIO < ? AND tbm_materiales.ID <> 0 AND tbd_cum_meses.ID_MES = 12
        GROUP BY tbm_anios.ANIO, tbm_materiales.TYPE_MATERIAL
        ORDER BY tbm_anios.ANIO, tbm_materiales.TYPE_MATERIAL
    `, [currentYear]).catch(error => {
            console.error("Error while executing SQL query:", error);
            return [];
        });


        const [currentYearData]: any = await conn.query(`
        SELECT 
            tbm_anios.ANIO as year,
            tbm_materiales.TYPE_MATERIAL as material,
            MAX(tbh_porc_cump_ci.VALOR_TON_VAL) as value
        FROM tbh_porc_cump_ci
        JOIN tbd_cum_anio ON tbh_porc_cump_ci.ID = tbd_cum_anio.ID_CUMP
        JOIN tbd_cum_materiales ON tbh_porc_cump_ci.ID = tbd_cum_materiales.ID_CUMP
        JOIN tbm_anios ON tbd_cum_anio.ID_ANIO = tbm_anios.ID
        JOIN tbm_materiales ON tbd_cum_materiales.ID_MATERIAL = tbm_materiales.ID
        JOIN tbd_cum_meses ON tbh_porc_cump_ci.ID = tbd_cum_meses.ID_CUMP
        WHERE tbm_anios.ANIO = ? AND tbm_materiales.ID <> 0 AND tbd_cum_meses.ID_MES = 12
        GROUP BY tbm_anios.ANIO, tbm_materiales.TYPE_MATERIAL
        ORDER BY tbm_materiales.TYPE_MATERIAL
        `, [currentYear]).catch(error => {
            console.error("Error while executing SQL query:", error);
            return [];
        });

        conn.end();
        const resultMapping: any = {};
        for (const row of previousYearsData) {

            if (!resultMapping[row.year]) {
                resultMapping[row.year] = {
                    name: row.year.toString(),
                    series: []
                };
            }
            resultMapping[row.year].series.push({
                name: row.material,
                value: parseFloat(parseFloat(row.value).toFixed(2))
            });
        }

        resultMapping[currentYear] = {
            name: currentYear.toString(),
            series: currentYearData.map((row: any) => ({
                name: row.material,
                value: parseFloat(parseFloat(row.value).toFixed(2))
            }))
        };

        return Object.values(resultMapping);
    }

    public async getAllTonByYear(year: string) {
        const conn = mysqlcon.getConnection();
        const statements = await conn?.execute(`
        SELECT  SUM(d.VALUE) as totalToneladas
        FROM detail_statement_form AS d
        INNER JOIN header_statement_form AS h
        ON d.ID_HEADER = h.ID
        WHERE h.YEAR_STATEMENT = ? AND (d.RECYCLABILITY = 1 OR d.RECYCLABILITY = 2) AND h.STATE = 1 and (d.TYPE_RESIDUE  = 1 OR d.TYPE_RESIDUE = 2 or d.TYPE_RESIDUE = 3)
        `, [year]).then((res) => res[0]).catch(error => { return undefined });
        conn?.end();
        return { statements };
    }


    public async getCountBusiness() {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query(`SELECT COUNT(DISTINCT NAME) AS total_empresas FROM business`).then(res => res[0]).catch(erro => undefined);
        conn.end();
        return res;
    }
}
const establishmentDao = new EstablishmentDao();
export default establishmentDao;

