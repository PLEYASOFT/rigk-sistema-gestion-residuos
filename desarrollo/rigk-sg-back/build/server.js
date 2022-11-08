"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const login_1 = __importDefault(require("./routes/login"));
const business_1 = __importDefault(require("./routes/business"));
const statmentProductor_1 = __importDefault(require("./routes/statmentProductor"));
class Server {
    constructor() {
        this.apiPath = {
            auth: '/api/v1/auth',
            business: '/api/v1/business',
            form: '/api/v1/statement',
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT_SV || '3000';
        this.config();
        this.routes();
    }
    routes() {
        this.app.use(this.apiPath.auth, login_1.default);
        this.app.use(this.apiPath.business, business_1.default);
        this.app.use(this.apiPath.form, statmentProductor_1.default);
        this.app.use((error, req, res, next) => {
            if (error) {
                console.log(error);
                res.status(400).json({ status: false, msg: "Error general" });
                next();
            }
            else {
                next(error);
            }
        });
    }
    config() {
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(express_1.default.json({ strict: true }));
        this.app.use((0, cors_1.default)({ origin: '*' }));
        this.app.use((0, morgan_1.default)('dev'));
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor escuchando en puerto ${this.port}`);
        });
    }
}
exports.default = Server;
