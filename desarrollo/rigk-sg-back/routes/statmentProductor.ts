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

router.get('/byUser', [validarJWT], statementProductorLogic.getStatementsByUser);
router.get('/:business/year/:year/isDraft/:draft', [validarJWT, verifyRolProductor, verifyParametersStatementByYear], statementProductorLogic.getStatmentByYear);
router.get('/draft/:business/year/:year', [validarJWT, verifyRolProductor], statementProductorLogic.verifyDraft);
router.get('/pdf/:id/year/:year', [validarJWT], statementProductorLogic.generatePDF);
router.get('/detail/:id_header', [validarJWT], statementProductorLogic.getDetailByIdHeader);
router.get('/year/:year', [validarJWT], statementProductorLogic.getAllStatementByYear);
router.get('/year2/:year', [validarJWT], statementProductorLogic.getAllStatementByYear2);
router.get('/resume/:id/year/:year', [], statementProductorLogic.getResumeById);
router.get('/:id', [validarJWT], statementProductorLogic.getProductor);
router.post('/', [validarJWT, verifyRolProductor, verifyParametersProductorForm], statementProductorLogic.saveForm);
router.post('/restapi', [validarJWT, verifyRolProductor], statementProductorLogic.respApiSaveStatement);
router.post('/OC/:id', [validarJWT, verifyRolProductor], statementProductorLogic.uploadOC);
router.put('/:id/state/:state', [validarJWT, verifyRolProductor, verifyParametersUpdateStateForm], statementProductorLogic.updateStateForm);
router.put('/validate/:id', [validarJWT, verifyRolProductor], statementProductorLogic.validateStatement);
router.put('/:id', [validarJWT, verifyRolProductor], statementProductorLogic.updateValuesForm);
router.all('**', (req: Request, res: Response) => { res.status(500).json({ status: false, msg: "Ruta incorrecta" }) });
export default router;