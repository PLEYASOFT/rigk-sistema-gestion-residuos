import { NextFunction, Request, Response} from "express";
// import jwt from 'jsonwebtoken'

const jwt = require('jsonwebtoken');

export const validarJWT = ( req: any, res: Response, next: NextFunction ) => {

    const token = req.header('x-token');

    if( !token  ) {
        return res.status(401).json({
            ok: false,
            msg: 'error en el token'
        });
    }

    try {

        const { uid, name, rol } = jwt.verify( token, process.env.SECRET_JWT_SEED! );
        
        req.uid  = uid;
        req.name = name;

        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }



    // TODO OK!
    next();
}