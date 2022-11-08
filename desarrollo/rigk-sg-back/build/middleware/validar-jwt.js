"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarJWT = void 0;
// import jwt from 'jsonwebtoken'
const jwt = require('jsonwebtoken');
const validarJWT = (req, res, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'error en el token'
        });
    }
    try {
        const { uid, name, rol } = jwt.verify(token, process.env.SECRET_JWT_SEED);
        req.uid = uid;
        req.name = name;
    }
    catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
    // TODO OK!
    next();
};
exports.validarJWT = validarJWT;
