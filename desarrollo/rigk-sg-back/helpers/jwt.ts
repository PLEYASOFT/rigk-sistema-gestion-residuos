import jwt from 'jsonwebtoken';

export const generarJWT = ( uid: any, name: any, rol: string ) => {
    const payload = { uid, name, rol };
    
    return new Promise( (resolve, reject) => {
        jwt.sign( payload, process.env.SECRET_JWT_SEED!, {
            expiresIn: '24h'
        }, (err: any, token: unknown) => {
    
            if ( err ) {
                // TODO MAL
                console.log(err);
                reject(err);
    
            } else {
                // TODO BIEN
                resolve( token )
            }
        })
    });
}