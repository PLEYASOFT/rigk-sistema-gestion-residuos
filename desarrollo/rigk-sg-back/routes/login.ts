import { Router } from "express";
import authLogic from '../controllers/authLogic';
import { validarJWT } from "../middleware/validar-jwt";
import { validateLogin } from "../middleware/validateLogin";
import { verifyParametersModifyPassword } from "../middleware/validators/modifyPassword";
import { recoveryPassword } from "../middleware/validators/recoveyPassword";

const router = Router();

router.post('/', [validateLogin], authLogic.login);
router.post('/modifyPassword', [validarJWT, verifyParametersModifyPassword], authLogic.modifyPassword);
router.post('/sendCode', [], authLogic.sendCode);
router.post('/sendCode/verify', [], authLogic.sendCodeVerify);
router.post('/sendCode/recovery', [], authLogic.recoveryPassword);
router.post('/register', [], authLogic.register);

export default router;