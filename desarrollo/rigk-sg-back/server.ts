import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import loginRoutes from './routes/login';
import businessRoutes from './routes/business';
import statementRoutes from './routes/statmentProductor';
class Server {

    private app: Application;
    private port: string;
    private apiPath = {
        auth: '/api/v1/auth',
        business: '/api/v1/business',
        form: '/api/v1/statement',
    }

    constructor() {
        this.app  = express();
        this.port = process.env.PORT_SV || '3000';
        this.config();
        
        this.routes();
    }
    routes() {
        this.app.use(this.apiPath.auth,loginRoutes);
        this.app.use(this.apiPath.business,businessRoutes);
        this.app.use(this.apiPath.form,statementRoutes);
        this.app.use((error:any, req:any, res:any, next:any) => {
            if (error) {
                console.log(error)
                res.status(400).json({status:false, msg:"Error general"});
                next();
              } else {
                next(error);
              }
        })
    }

    config() {
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(express.json({strict: true}));
        this.app.use(cors({origin: '*'}));
        this.app.use(morgan('dev'));
        
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log(`Servidor escuchando en puerto ${this.port}`);
        });
    }

    
}

export default Server;