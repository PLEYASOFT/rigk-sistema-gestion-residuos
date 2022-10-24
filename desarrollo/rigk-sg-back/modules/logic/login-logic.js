const loginDao = require('../dao/login-dao');

class LoginLogic {
    async login(req, res) {
        try{
            const output = await loginDao.login(req.body.user, req.body.password);
            res.send(output);
        }
        catch(err){
            console.log(err)
            res.send({status: 0, message: "Ocurrió un error"});
        }
    }
}

module.exports = new LoginLogic();