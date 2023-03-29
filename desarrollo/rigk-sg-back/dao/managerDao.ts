import mysqlcon from '../db';
class ManagerDao {
    async addManager(TYPE_MATERIAL: string, REGION: string, ID_BUSINESS: number) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("INSERT INTO manager(TYPE_MATERIAL,REGION) VALUES (?,?)", [TYPE_MATERIAL, REGION]).then((res) => res[0]).catch(error => [{ undefined }]);
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
        const manager: any = await conn.query("SELECT manager.TYPE_MATERIAL, manager.REGION, manager_business.ID_BUSINESS,manager_business.ID_MANAGER FROM manager_business INNER JOIN manager ON manager.ID = manager_business.ID_MANAGER WHERE manager_business.ID_BUSINESS=?", [ID]).then((res) => res[0]).catch(error => [{ undefined }]);
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
}
const managerDao = new ManagerDao();
export default managerDao;