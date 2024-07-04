import mysqlcon from '../db';
class LogsDao {
    async getLogs(ds:any,de:any) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("SELECT logs.*, user.FIRST_NAME, user.LAST_NAME, rol.NAME as USER_PROFILE FROM logs INNER JOIN user ON user.ID = logs.ID_USER INNER JOIN user_rol ON user_rol.USER_ID = logs.ID_USER INNER JOIN rol on rol.ID = user_rol.ROL_ID WHERE logs.CREATED_AT>=? and logs.CREATED_AT<? ORDER BY logs.ID ASC", [ds,de]).then((res) => res[0]).catch(error => { console.log(error); return [{ undefined }]});
        conn.end();
        return res;
    }
}
const logsDao = new LogsDao();
export default logsDao;