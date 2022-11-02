import mysqlcon from '../db';


class SendCodeDao {

    async sendCode(USER: string) {
        const conn = mysqlcon.getConnection()!;
        const res = await conn.query("SELECT * FROM USER WHERE USER = ?", USER).then((res) => res[0]).catch(error => {undefined});

        let recovery = false;
        if(res != null && res != undefined) {
            recovery = true;
        } else {
            console.log("Correo no es  correcto, intente nuevamente");
        }
        conn.end();
        return recovery;
    }
}

const sendCodeDao = new SendCodeDao();
export default sendCodeDao;