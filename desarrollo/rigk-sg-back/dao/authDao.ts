import mysqlcon from '../db';
class AuthDao {
    async getPassword(ID: string) {
        const conn = mysqlcon.getConnection()!;
        const res_passwd: any = await conn.query("SELECT PASSWORD, SALT FROM user WHERE ID = ?", [ID]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res_passwd[0];
    }
    async updatePassword(PASSWORD: string, USER: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("UPDATE user SET PASSWORD = ? WHERE ID = ?", [PASSWORD, USER]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res;
    }
    async login(USER: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query(`
            SELECT user.*, user_rol.ROL_ID AS ROL, rol.NAME AS ROL_NAME, business.NAME AS BUSINESS, 
            business.ID as ID_BUSINESS 
            FROM user 
            INNER JOIN user_rol ON user_rol.USER_ID = user.ID 
            INNER JOIN user_business ON user_business.ID_USER = user.ID 
            INNER JOIN business ON business.ID = user_business.ID_BUSINESS 
            INNER JOIN rol ON rol.ID = user_rol.ROL_ID 
            WHERE user.EMAIL = ? AND user.STATE = 1
        `, [USER]).then((res) => res[0]).catch(error => { console.log(error); return [{ undefined }]; });
    
        conn.end();
    
        let user: any = {};
        let name_business = [];
        let id_business = [];
        let roles = [];
        let roleNames = [];
    
        for (let i = 0; i < res.length; i++) {
            name_business.push(res[i].BUSINESS);
            id_business.push(res[i].ID_BUSINESS);
            roles.push(res[i].ROL);
            roleNames.push(res[i].ROL_NAME);
        }
    
        let name_business_unique = Array.from(new Set(name_business));
        let id_business_unique = Array.from(new Set(id_business));
        let roles_unique = Array.from(new Set(roles));
        let roleNames_unique = Array.from(new Set(roleNames));
    
        user = { ...res[0] };
        user.BUSINESS = name_business_unique;
        user.ID_BUSINESS = id_business_unique;
        user.ROLES = roles_unique.map((roleId, index) => ({ id: roleId, name: roleNames_unique[index] }));
    
        let login = false;
        if (res != null && res != undefined && res.length > 0) {
            login = true;
        }
    
        if (login) {
            return user;
        }
    
        return undefined;
    }
    

    async verifyEmail(USER: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("SELECT EMAIL,ID,PASSWORD FROM user WHERE EMAIL = ?", [USER]).then((res) => res[0]).catch(error => [{ undefined }]);
        let login = false;
        conn.end();
        if (res != null && res != undefined && res.length > 0) {
            login = true;
            return res[0];
        } else {
            return res;
        }
    }
    async generateCode(CODE: string, ID: string) {
        const conn = mysqlcon.getConnection()!;
        const now = new Date();
        const res: any = await conn.query("UPDATE user SET CODE = ?, DATE_CODE = ? WHERE ID=?", [CODE, now, ID]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res;
    }
    async verifyCode(CODE: string, USER: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("SELECT CODE,DATE_CODE,ID FROM user WHERE CODE = ? AND EMAIL =?", [CODE, USER]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        let login = false;
        if (res != null && res != undefined && res.length > 0) {
            login = true;
            return res[0];
        } else {
            return res;
        }
    }
    async recovery(PASSWORD: string, USER: string) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("UPDATE user SET PASSWORD = ? WHERE EMAIL = ?", [PASSWORD, USER]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res
    }
    async register(EMAIL: string, FIRST_NAME: string, LAST_NAME: string, PASSWORD: string, PHONE: string, PHONE_OFFICE: string, POSITION: string, ROL: any[]) {
        const conn = mysqlcon.getConnection()!;
        const res_0: any = await conn.execute("SELECT * FROM user WHERE EMAIL = ? AND STATE=1", [EMAIL]).then((res) => res[0]).catch(error => [{ undefined }]);
        if (res_0.length > 0) {
            return [];
        }
        const res: any = await conn.query("INSERT INTO user(EMAIL,FIRST_NAME,LAST_NAME, PASSWORD,PHONE, STATE, SALT,PHONE_OFFICE,POSITION) VALUES (?,?,?,?,?,?,'ABC',?,?)", [EMAIL, FIRST_NAME, LAST_NAME, PASSWORD, PHONE, 1, PHONE_OFFICE, POSITION]).then((res) => res[0]).catch(error => { [{ undefined }] });
        for (let i = 0; i < ROL.length; i++) {
            await conn.query("INSERT INTO user_rol(USER_ID,ROL_ID) VALUES (?,?)", [res.insertId, ROL[i]]).then((res) => res[0]).catch(error => [{ undefined }]);
        }
        conn.end();
        return res
    }
    public async users() {
        const conn = mysqlcon.getConnection()!;
        const query = `SELECT user.ID, user.EMAIL, user.FIRST_NAME, user.LAST_NAME, user.STATE, user.PHONE, user.PHONE_OFFICE, user.POSITION, rol.ID as ID_ROL, rol.NAME as ROL_NAME, 
        business.NAME as BUSINESS_NAME, user_business.ID_BUSINESS FROM user LEFT JOIN user_rol ON user_rol.USER_ID = user.ID LEFT JOIN rol ON rol.ID = user_rol.ROL_ID 
        LEFT JOIN user_business ON user_business.ID_USER=user.ID INNER JOIN business ON business.ID = user_business.ID_BUSINESS WHERE user.STATE = 1`;
        const res: any = await conn.query(query, []).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res;
    }
    public async deleteUser(id: any) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("UPDATE user SET STATE=0 WHERE ID=?", [id]).then((res) => res[0]).catch(error => { console.log(error); return undefined });
        conn.end();
        return res;
    }
    public async getRoles() {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("SELECT * FROM rol", []).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res;
    }
    public async addUserBusiness(id_user: any, array_id_business: any) {
        const conn = mysqlcon.getConnection()!;
        try {
            const currentRelations = await conn.query("SELECT ID_BUSINESS, DJ_FILE FROM user_business WHERE ID_USER=?", [id_user]);
            await conn.query("DELETE FROM user_business WHERE ID_USER=?", [id_user]);
            const currentRelationsArray = currentRelations[0] as { ID_BUSINESS: any, DJ_FILE: any }[];
            for (const id_business of array_id_business) {
                const currentRelation = currentRelationsArray.find((relation) => relation.ID_BUSINESS === id_business);
                const currentDJFile = currentRelation ? currentRelation.DJ_FILE : null;
    
                if (currentDJFile === null) {
                    await conn.query("INSERT INTO user_business (ID_USER, ID_BUSINESS, DJ_FILE) VALUES (?, ?, NULL)", [id_user, id_business]);
                } else {
                    await conn.query("INSERT INTO user_business (ID_USER, ID_BUSINESS, DJ_FILE) VALUES (?, ?, ?)", [id_user, id_business, currentDJFile]);
                }
            }
            return { status: true, msg: 'Relaciones de usuario y empresas actualizadas correctamente', data: [] };
        } catch (error: any) {
            console.log(error);
            return { status: false, msg: 'Ocurrió un error al actualizar las relaciones de usuario y empresas', data: {} };
        } finally {
            conn.end();
        }
    }
    public async addUserRoles(id_user: any, id_rol: any) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("INSERT INTO user_rol VALUES(?,?)", [id_user, id_rol]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res;
    }
    public async updateUser(ID: any, FIRST_NAME: any, LAST_NAME: any, EMAIL: any, PHONE: any, PHONE_OFFICE: any, POSITION: any) {
        const conn = mysqlcon.getConnection()!;
        const res: any = await conn.query("UPDATE user SET FIRST_NAME=?, LAST_NAME=?, EMAIL=?, PHONE=?, PHONE_OFFICE=?, POSITION=? WHERE ID = ?", [FIRST_NAME, LAST_NAME, EMAIL, PHONE, PHONE_OFFICE, POSITION, ID]).then((res) => res[0]).catch(error => [{ undefined }]);
        await conn.query("DELETE FROM user_rol WHERE USER_ID=?", [ID]).then((res) => res[0]).catch(error => [{ undefined }]);
        conn.end();
        return res;
    }
}
const authDao = new AuthDao();
export default authDao;