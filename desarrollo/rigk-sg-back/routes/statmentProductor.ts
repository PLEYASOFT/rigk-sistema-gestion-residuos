import { Request, Response, Router } from "express";
import statementProductorLogic from '../controllers/statementProductorLogic';
import { validarJWT } from "../middleware/validar-jwt";
import {
        verifyParametersStatementByYear,
        verifyParametersProductorForm,
        verifyParametersUpdateStateForm
} from "../middleware/validators/validatorsCustom";
import { verifyRolProductor } from "../middleware/roles/rolesCustom";

const router = Router();

router.get('/:business/year/:year/isDraft/:draft', [validarJWT, verifyRolProductor, verifyParametersStatementByYear], statementProductorLogic.getStatmentByYear);
router.get('/draft/:business/year/:year', [validarJWT, verifyRolProductor], statementProductorLogic.verifyDraft);
router.post('/', [validarJWT, verifyRolProductor, verifyParametersProductorForm], statementProductorLogic.saveForm);
router.put('/:id/state/:state', [validarJWT, verifyRolProductor, verifyParametersUpdateStateForm], statementProductorLogic.updateStateForm);
router.put('/:id', [validarJWT, verifyRolProductor], statementProductorLogic.updateValuesForm);

router.all('**', (req: Request, res: Response) => { res.status(500).json({ status: false, msg: "Ruta incorrecta" }) });

export default router;