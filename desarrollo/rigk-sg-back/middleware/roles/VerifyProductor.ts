import { NextFunction, Response} from "express";
const jwt = require('jsonwebtoken');
export const verifyRolProductor = ( req: any, res: Response, next: NextFunction ) => {

    const token = req.header('x-token');

    if( !token  ) {
        console.log("first3")
        return res.status(401).json({
            ok: false,
            msg: 'error en el token'
        });
    }
    try {
        const { uid, name } = jwt.verify( token, process.env.SECRET_JWT_SEED! );
        const rol = 1;
        
        if(rol != 1) {
            return res.status(401).json({
                ok: false,
                msg: 'Token no válido2'
            });
        }
        req.uid  = uid;
        req.name = name;
        console.log("first2")
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
    next();
}