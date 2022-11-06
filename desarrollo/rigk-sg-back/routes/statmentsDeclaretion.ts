import { Router } from "express";
import statementDeclaretionLogic from '../controllers/statementDeclaretionLogic';

const router = Router();

router.get('/:business/previous/:year', [ ], statementDeclaretionLogic.previous);
router.post('/', [], statementDeclaretionLogic.saveForm);
router.put('/:id/state/:state', [], statementDeclaretionLogic.saveForm);