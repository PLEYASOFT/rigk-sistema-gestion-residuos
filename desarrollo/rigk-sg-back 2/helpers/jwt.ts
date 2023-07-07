import jwt from 'jsonwebtoken';
export const generarJWT = (uid: any, name: any, rol: any) => {
    const payload = { uid, name, rol };
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.SECRET_JWT_SEED!, {
            expiresIn: '60m'
        }, (err: any, token: unknown) => {
            if (err) {
                console.log(err);
                reject(err);

            } else {
                resolve(token);
            }
        });
    });
};