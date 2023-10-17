import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generarJWT } from '../helpers/jwt';
import { sendCode } from '../helpers/sendCode';
import authDao from '../dao/authDao';
import { createLog } from '../helpers/createLog';
class AuthLogic {
    async modifyPassword(req: any, res: Response) {
        const { newPassword, actual } = req.body;
        const repeatPassword = req.body.repeatPassword;
        const user = req.uid;
        try {
            if (newPassword !== repeatPassword) {
                return res.status(200).json({ status: false, msg: 'contraseña no coincide', data: {} });
            }
            else if (newPassword == '' || repeatPassword == '') {
                return res.status(200).json({ status: false, msg: 'ingrese una contraseña', data: {} });
            }
            else {
                const output = await authDao.getPassword(user);
                bcrypt.compare(actual, output.PASSWORD).then(async (r) => {
                    if (r) {
                        let passwordHash = bcrypt.hashSync(newPassword, 8);
                        await authDao.updatePassword(passwordHash, user);
                        await createLog('CAMBIA_CONTRASENA', req.uid, null);
                        res.status(200).json({ status: true, msg: 'Contraseña cambiada', data: {} });
                    }
                    else {
                        await createLog('CAMBIA_CONTRASENA', req.uid, 'Contraseña Incorrecta');
                        res.status(200).json({ status: false, msg: 'Contraseña incorrecta, intenta nuevamente', data: {} });
                    }
                });
            }
        } catch (err: any) {
            await createLog('CAMBIA_CONTRASENA', req.uid, err.message);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }
    async login(req: Request, res: Response) {
        const user = req.body.user;
        const password = req.body.password;
        try {
            const output = await authDao.login(user);
            if (output != undefined) {
                bcrypt.compare(password, output.PASSWORD).then(async (r) => {
                    if (r) {
                        const token: any = await generarJWT(output.ID, user, output.ROL);
                        delete output.PASSWORD;
                        delete output.SALT;
                        delete output.STATE;
                        delete output.DATE_CODE;
                        delete output.CODE
                        res.header('x-token', token!.toString());
                        res.header("Access-Control-Expose-Headers", "*");
                        await createLog('AUTENTICACION', output.ID, null);
                        res.status(200).json({ status: true, msg: '', data: { user: output } });
                    }
                    else {
                        await createLog('AUTENTICACION', output.ID, `Usuario y/o contraseña incorrectos. Usuario: ${user}`);
                        res.status(200).json({ status: false, msg: 'Usuario y/o contraseña incorrectos, intenta nuevamente', data: {} });
                    }
                });
            }
            else {
                await createLog('AUTENTICACION', output.ID, `Usuario y/o contraseña incorrectos. Usuario: ${user}`);
                res.status(200).json({ status: false, msg: 'Usuario y/o contraseña incorrectos, intenta nuevamente', data: {} });
            }
        }
        catch (err: any) {
            await createLog('AUTENTICACION', null, `${err.message}`);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }
    public async profile(req: any, res: Response) {
        const { email } = req.params;
        try {
            const output = await authDao.login(email);
            delete output.PASSWORD;
            delete output.SALT;
            delete output.STATE
            delete output.DATE_CODE;
            delete output.CODE
            delete output.ID;
            res.status(200).json({ status: true, msg: '', data: { user: output } });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }
    async sendCode(req: Request, res: Response) {
        const { user } = req.body;
        try {
            const output = await authDao.verifyEmail(user);
            if (output.EMAIL == user) {
                const cod = (Math.random() * (999999 - 100000) + 100000).toFixed(0);
                await authDao.generateCode(cod, output.ID);

                sendCode(output, cod, res);
                res.status(200).json({ status: true, msg: '', data: output.EMAIL });
            }

            else {
                res.status(200).json({ status: false, msg: 'Correo no registrado', data: {} });
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }
    async sendCodeVerify(req: Request, res: Response) {
        const code = req.body.code;
        const { user } = req.body;
        try {
            const output = await authDao.verifyCode(code, user);
            if (output.CODE == code) {
                const now = new Date().getTime();
                const dateCode = new Date(output.DATE_CODE).getTime();
                const dif2 = ((now - dateCode) / (60000));
                if (dif2 <= 5) {
                    res.status(200).json({ status: true, msg: 'Código correcto, modifique contraseña', data: {} });
                }
                else {
                    res.status(200).json({ status: false, msg: 'Código expirado, solicitelo nuevamente', data: {} });
                }
            }
            else {
                res.status(200).json({ status: false, msg: 'Código incorrecto', data: {} });
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }
    async recoveryPassword(req: Request, res: Response) {
        const user = req.body.user;
        const password = req.body.password;
        const repeatPassword = req.body.repeatPassword;
        try {
            if (password !== repeatPassword) {
                return res.status(200).json({ status: false, msg: 'contraseña no coincide', data: {} });
            }
            else if (password == '' || repeatPassword == '') {
                res.status(200).json({ status: false, msg: 'Contraseña vacía', data: {} });
            }
            else {
                let passwordHash = bcrypt.hashSync(password, 8);
                await authDao.recovery(passwordHash, user);
                res.status(200).json({ status: true, msg: 'Haz recuperado tu contraseña', data: {} });
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }
    async register(req: Request | any, res: Response) {
        const user = req.body.EMAIL;
        const first_name = req.body.FIRST_NAME;
        const last_name = req.body.LAST_NAME;
        const password = req.body.PASSWORD || '1231231234';
        const phone = req.body.PHONE;
        const phone_office = req.body.PHONE_OFFICE;
        const position = req.body.POSITION;
        const { ROL, BUSINESS } = req.body;
        try {
            let passwordHash = bcrypt.hashSync(password, 8);
            const result = await authDao.register(user, first_name, last_name, passwordHash, phone, phone_office, position, ROL);
            if (result.length == 0) {
                await createLog('AGREGA_USUARIO', req.uid, 'Correo Existe');
                return res.status(200).json({ status: false, msg: 'Correo existe', data: {} });
            }
            for (let i = 0; i < BUSINESS.length; i++) {
                const b = BUSINESS[i];
                await authDao.addUserBusiness(result.insertId, b);
            }
            await createLog('AGREGA_USUARIO', req.uid, null);
            res.status(200).json({ status: true, msg: 'Has creado usuario', data: {} });
        }
        catch (err: any) {
            console.log(err);
            await createLog('AGREGA_USUARIO', req.uid, err.message);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }
    public async getUsers(req: Request, res: Response) {
        try {
            const users = await authDao.users();
            const tmp: any[] = [];
            for (let i = 0; i < users.length; i++) {
                const u = users[i];
                const indx = tmp.findIndex(r => r.ID == u.ID);
                if (indx == -1) {
                    u.BUSINESS = [{ ID_BUSINESS: u.ID_BUSINESS, NAME: u.BUSINESS_NAME }];
                    tmp.push(u);
                    continue;
                } else {
                    tmp[indx].BUSINESS.push({ ID_BUSINESS: u.ID_BUSINESS, NAME: u.BUSINESS_NAME });
                    continue;
                }
            }
            res.status(200).json({ status: true, msg: '', data: tmp });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }
    public async getRoles(req: Request, res: Response) {
        try {
            const roles = await authDao.getRoles();
            res.status(200).json({ status: true, msg: '', data: roles });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }
    public async deleteUserByID(req: Request | any, res: Response) {
        const { id } = req.params;
        try {
            await authDao.deleteUser(id);
            await createLog('ELIMINA_USUARIO', req.uid, null);
            res.status(200).json({ status: true, msg: 'Usuario eliminado', data: [] });
        } catch (error: any) {
            console.log(error);
            await createLog('ELIMINA_USUARIO', req.uid, error.message);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }
    public async updateUser(req: Request | any, res: Response) {
        const { ID, FIRST_NAME, LAST_NAME, EMAIL, ROL, PHONE, PHONE_OFFICE, POSITION, BUSINESS } = req.body;
        try {
            await authDao.updateUser(ID, FIRST_NAME, LAST_NAME, EMAIL, ROL, PHONE, PHONE_OFFICE, POSITION);
            for (let i = 0; i < BUSINESS.length; i++) {
                const b = BUSINESS[i];
                await authDao.addUserBusiness(ID, b);
            }
            await createLog('MODIFICA_USUARIO', req.uid, null);
            res.status(200).json({ status: true, msg: 'Usuario actualizado satisfactoriamente', data: [] });
        } catch (error: any) {
            await createLog('MODIFICA_USUARIO', req.uid, error.message);
            console.log(error);
            res.status(500).json({ status: false, msg: 'Ocurrió un error', data: {} });
        }
    }
    public async logout(req: any, res: Response) {
        await createLog('CIERRE_SESION', req.uid, null);
        res.json({ status: true });
    }
}
const authLogic = new AuthLogic();
export default authLogic;