"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyParameters = void 0;
const verifyParameters = (req, res, next) => {
    const { id, user } = req.params;
    if (parseInt(id) == NaN || parseInt(user) == NaN) {
        return res.status(400).json({
            status: false,
            message: "parámetros incorrectos"
        });
    }
    next();
};
exports.verifyParameters = verifyParameters;
