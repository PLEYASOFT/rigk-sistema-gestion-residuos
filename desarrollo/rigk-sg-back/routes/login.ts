import { Router } from "express";
import loginLogic from "../controllers/loginLogic";
import recoveryLogic from "../controllers/recoveryLogic";
import sendCodeLogic from '../controllers/sendCodeLogic';
import { veriryemail } from '../middleware/verifyemail';
import codeVerifyLogic from '../controllers/codeVerifyLogic';

const router = Router();

router.post('/login', [ ], loginLogic.login);
router.post('/recovery', [ ], recoveryLogic.recovery);
router.post('/sendCode', [ ], sendCodeLogic.sendCode);
router.post('/sendCode/verify', [ ], codeVerifyLogic.sendCode);
export default router;