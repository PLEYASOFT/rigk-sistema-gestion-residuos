import express, { Application, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';
import { RateLimiterMemory } from 'rate-limiter-flexible'
import loginRoutes from './routes/login';
import businessRoutes from './routes/business';
import statementRoutes from './routes/statmentProductor';
import ratesRoutes from './routes/rates';
import establishmentRoutes from './routes/establishment';
import consumerRoutes from './routes/consumer';
class Server {
    private app: Application;
    private port: string;
    private apiPath = {
        auth: '/api/v1/auth',
        business: '/api/v1/business',
        form: '/api/v1/statement',
        consumer: '/api/v1/consumer',
        rates: '/api/v1/rates',
        establishment: '/api/v1/establishment'
    };
    constructor() {
        this.app = express();
        this.port = process.env.PORT_SV || '3000';
        this.config();
        this.routes();
    }
    routes() {
        this.app.use(this.apiPath.auth, loginRoutes);
        this.app.use(this.apiPath.business, businessRoutes);
        this.app.use(this.apiPath.consumer, consumerRoutes);
        this.app.use(this.apiPath.form, statementRoutes);
        this.app.use(this.apiPath.rates, ratesRoutes);
        this.app.use(this.apiPath.establishment, establishmentRoutes);
        this.app.use((error: any, req: any, res: any, next: any) => {
            if (error) {
                console.log(error)
                res.status(400).json({ status: false, msg: "Error general" });
                next();
            } else {
                next(error);
            }
        });
    }
    config() {
        // const opts = {
        //     points: 5, // 5 points
        //     duration: 10, // Per second
        //     blockDuration: 300, // block for 5 minutes if more than points consumed 
        // };
        // const rateLimiter = new RateLimiterMemory(opts);
        // const rateLimiterMiddleware = (req: any, res: any, next: any) => {
        //     rateLimiter.consume(req.connection.remoteAddress)
        //         .then(() => {
        //             next();
        //         })
        //         .catch((rejRes) => {
        //             res.status(429).json({
        //                 status: false,
        //                 msg: 'Too Many Requests'
        //             });
        //         });
        // };
        // this.app.use(rateLimiterMiddleware);
        this.app.use(helmet({
            contentSecurityPolicy: true,
            hidePoweredBy: true,
            frameguard: { action: 'deny' },
            crossOriginResourcePolicy: true,
            crossOriginEmbedderPolicy: { policy: 'credentialless' },
            crossOriginOpenerPolicy: true,
            xssFilter: true
        }));
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json({ strict: true }));
        this.app.use(cors({ origin: '*' }));
        this.app.use(fileUpload({
            limits: { fileSize: 1024 * 1024 * 1 }
        }));
        this.app.use(morgan('dev'));
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor escuchando en puerto ${this.port}`);
        });
    }
}
export default Server;