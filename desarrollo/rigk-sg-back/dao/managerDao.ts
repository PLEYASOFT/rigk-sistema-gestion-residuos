import mysqlcon from '../db';
class ManagerDao {
    async addManager(TYPE_MATERIAL: string, REGION: string, ID_BUSINESS: number) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("INSERT INTO manager(COD_MATERIAL,REGION) VALUES (?,?)", [TYPE_MATERIAL, REGION]).then((res) => res[0]).catch(error => [{ undefined }]);
        const managerId = res.insertId; // Obtener el ID del nuevo establecimiento insertado
        // Insertar una nueva fila en la tabla manager_business
        await conn.query("INSERT INTO manager_business(ID_MANAGER, ID_BUSINESS ) VALUES (?,?)", [managerId, ID_BUSINESS]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res;
    }
    public async getAllManager() {
        const conn = mysqlcon.getConnection()!;
        const manager: any = await conn.query("SELECT * FROM manager").then(res => res[0]).catch(erro => undefined);
        if (manager == null || manager.length == 0) {
            return false;
        }
        conn.end();
        return manager;
    }
    public async getManager(ID: any) {
        const conn = mysqlcon.getConnection()!;
        const manager: any = await conn.query("SELECT manager.ID, type_material.material AS MATERIAL, manager.REGION, manager_business.ID_BUSINESS, manager_business.ID_MANAGER FROM manager_business INNER JOIN manager ON manager.ID = manager_business.ID_MANAGER INNER JOIN type_material ON manager.COD_MATERIAL = type_material.ID WHERE manager_business.ID_BUSINESS=?", [ID]).then((res) => res[0]).catch(error => [{ undefined }]);
        if (manager == null || manager.length == 0) {
            return false;
        }
        conn.end();
        return manager;
    }
    public async deleteManager(ID: any) {
        const conn = mysqlcon.getConnection()!;
        await conn.query("DELETE FROM manager_business WHERE ID_MANAGER = ?", [ID]).then((res) => res[0]).catch(error => [{ undefined }]);
        const res: any = await conn.query("DELETE FROM manager WHERE ID=?", [ID]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res;
    }

    public async getAllMaterials() {
        const conn = mysqlcon.getConnection()!;
        const material: any = await conn.query("SELECT * FROM type_material").then(res => res[0]).catch(erro => undefined);
        if (material == null || material.length == 0) {
            return false;
        }
        conn.end();
        return material;
    }

    public async getManagersByMaterials(materials: string[], REGION: string) {
        const conn = mysqlcon.getConnection()!;
        const placeholders = materials.map(() => '?').join(',');
        const query = `
            SELECT manager.ID AS ID_MANAGER, manager_business.ID_BUSINESS, business.NAME AS BUSINESS_NAME, manager.COD_MATERIAL
            FROM manager
            INNER JOIN manager_business ON manager.ID = manager_business.ID_MANAGER
            INNER JOIN business ON manager_business.ID_BUSINESS = business.ID
            WHERE manager.COD_MATERIAL IN (${placeholders}) AND manager.REGION = ?
        `;
        const params = [...materials, REGION];
        const managerList: any = await conn.query(query, params).then((res) => res[0]).catch(error => [{ undefined }]);
        if (managerList == null || managerList.length == 0) {
            return false;
        }
        conn.end();
        return managerList;
    }

    public async getAllRegions() {
        const conn = mysqlcon.getConnection()!;
        const query = await conn.query("SELECT NAME FROM regions").then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return query;
    }
    public async getAllCommunes() {
        const conn = mysqlcon.getConnection()!;
        const query = await conn.query("SELECT NAME FROM communes").then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return query;
    }
    public async getAllSubmaterial() {
        const conn = mysqlcon.getConnection()!;
        const query = await conn.query("SELECT SUBMATERIAL FROM submaterial").then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return query;
    }
}
const managerDao = new ManagerDao();
export default managerDao;