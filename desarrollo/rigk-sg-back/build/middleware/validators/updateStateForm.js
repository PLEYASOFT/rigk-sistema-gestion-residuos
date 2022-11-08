"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyParametersUpdateStateForm = void 0;
const verifyParametersUpdateStateForm = (req, res, next) => {
    try {
        const { id, state } = req.params;
        if (parseInt(id) && Boolean(state)) {
            return next();
        }
        return res.status(400).json({ status: false, msg: "Formato inválido" });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, msg: "Formato inválido" });
    }
};
exports.verifyParametersUpdateStateForm = verifyParametersUpdateStateForm;
