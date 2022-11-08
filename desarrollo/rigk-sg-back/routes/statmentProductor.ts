import { Request, Response, Router } from "express";
import statementProductorLogic from '../controllers/statementProductorLogic';

import { validarJWT } from "../middleware/validar-jwt";


import { verifyParametersStatementByYear,
        verifyParametersProductorForm,
        verifyParametersUpdateStateForm
 } from "../middleware/validators/validatorsCustom";


import { verifyRolProductor } from "../middleware/roles/rolesCustom";


const router = Router();

router.get('/:business/year/:year', [validarJWT, verifyRolProductor, verifyParametersStatementByYear], statementProductorLogic.getStatmentByYear);
router.post('/', [validarJWT, verifyRolProductor, verifyParametersProductorForm], statementProductorLogic.saveForm);
router.put('/:id/state/:state', [validarJWT, verifyRolProductor, verifyParametersUpdateStateForm], statementProductorLogic.updateStateForm);

router.all('**', (req: Request, res: Response) => {res.status(500).json({status: false, msg: "Ruta incorrecta"})});

export default router;
