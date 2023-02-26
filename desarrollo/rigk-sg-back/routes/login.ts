import { Router } from "express";
import authLogic from '../controllers/authLogic';
import { validarJWT } from "../middleware/validar-jwt";
import { validateLogin } from "../middleware/validateLogin";
import { verifyParametersModifyPassword } from "../middleware/validators/modifyPassword";
import { recoveryPassword } from "../middleware/validators/recoveyPassword";
import { validaRegisterUser } from "../middleware/validators/usersManagementForm";

const router = Router();

router.get('/', [], authLogic.getUsers);
router.get('/roles', [], authLogic.getRoles);
router.get('/profile/:email', [validarJWT], authLogic.profile);
router.post('/', [validateLogin], authLogic.login);
router.post('/modifyPassword', [validarJWT, verifyParametersModifyPassword], authLogic.modifyPassword);
router.post('/sendCode', [], authLogic.sendCode);
router.post('/sendCode/verify', [], authLogic.sendCodeVerify);
router.post('/sendCode/recovery', [recoveryPassword], authLogic.recoveryPassword);
router.post('/register', [validaRegisterUser], authLogic.register);
router.put('/', [validarJWT, validaRegisterUser], authLogic.updateUser);
router.delete('/:id', [validarJWT], authLogic.deleteUserByID);

export default router;