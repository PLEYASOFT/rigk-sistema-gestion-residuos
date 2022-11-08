"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyParametersStatementByYear = void 0;
const verifyParametersStatementByYear = (req, res, next) => {
    try {
        const { business, year } = req.params;
        if (parseInt(business) && parseInt(year)) {
            return next();
        }
        return res.status(400).json({ status: false, msg: "Formato inválido" });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, msg: "Formato inválido" });
    }
};
exports.verifyParametersStatementByYear = verifyParametersStatementByYear;
