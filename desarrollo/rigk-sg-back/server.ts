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
import goalsRoutes from './routes/goals';
import establishmentRoutes from './routes/establishment';
import consumerRoutes from './routes/consumer';
import managerRoutes from './routes/manager';
import utilesRoutes from './routes/utiles'
import logsRoutes from './routes/logs';
class Server {
    private app: Application;
    private port: string;
    private apiPath = {
        auth: '/api/v1/auth',
        business: '/api/v1/business',
        form: '/api/v1/statement',
        consumer: '/api/v1/consumer',
        rates: '/api/v1/rates',
        establishment: '/api/v1/establishment',
        manager: '/api/v1/manager',
        utiles: '/api/v1/utiles',
        logs: '/api/v1/logs',
        goals: '/api/v1/goals'
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
        this.app.use(this.apiPath.goals, goalsRoutes);
        this.app.use(this.apiPath.establishment, establishmentRoutes);
        this.app.use(this.apiPath.logs, logsRoutes);
        this.app.use(this.apiPath.manager, managerRoutes);
        this.app.use(this.apiPath.utiles, utilesRoutes);
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
        const opts = {
            points: 50,
            duration: 1,
            blockDuration: 300
        };
        const rateLimiter = new RateLimiterMemory(opts);
        const rateLimiterMiddleware = (req: any, res: any, next: any) => {
            rateLimiter.consume(req.connection.remoteAddress, 1)
                .then((rateLimiterRes) => {
                    res.set('X-RateLimit-Remaining', rateLimiterRes.remainingPoints);
                    res.set("X-RateLimit-Reset", new Date(Date.now() + rateLimiterRes.msBeforeNext));
                    next();
                })
                .catch((rateLimiterRes) => {
                    res.set('X-RateLimit-Remaining', rateLimiterRes.remainingPoints);
                    res.set("X-RateLimit-Reset", new Date(Date.now() + rateLimiterRes.msBeforeNext));
                    console.log("Bloqueado x DOS");
                    res.status(429).json({
                        status: false,
                        msg: 'Too Many Requests'
                    });
                });
        };
        this.app.use(rateLimiterMiddleware);
        var whitelist = ['http://localhost:4200', 'https://prorep.us-east-1.elasticbeanstalk.com'];
        var corsOptionsDelegate = function (req: any, callback: any) {
            var corsOptions;
            if (whitelist.indexOf(req.header('Origin')) !== -1) {
                corsOptions = { origin: true };
            } else {
                corsOptions = { origin: false };
            }
            callback(null, corsOptions);
        };
        this.app.use(helmet({
            contentSecurityPolicy: true,
            hidePoweredBy: true,
            frameguard: { action: 'deny' },
            referrerPolicy: {
                policy: "no-referrer",
            },
            crossOriginResourcePolicy: true,
            crossOriginEmbedderPolicy: { policy: 'credentialless' },
            crossOriginOpenerPolicy: true,
            xssFilter: true,
            hsts: true
        }));
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json({ strict: true }));
        this.app.use(cors(corsOptionsDelegate));
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