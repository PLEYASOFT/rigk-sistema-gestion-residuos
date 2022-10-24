const mysqlcon = require("./db-connection");

class LoginDao {
    async login(USER, PASSWORD) {
        const conn = mysqlcon.getConnection();
        const res = await conn.query("SELECT * FROM USER WHERE USER = " + conn.escape(USER) + " AND PASSWORD = " + conn.escape(PASSWORD)).then((res) => res[0]).catch(error => {undefined});
        let login = false;
        console.log("El res es " + res);
        if(res != null && res != undefined) {
            login = true;
        } else {
            console.log("Acá !!!");
        }
        conn.end();
        return login;
    }
}

module.exports = new LoginDao();
