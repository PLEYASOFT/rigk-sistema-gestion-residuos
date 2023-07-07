import dotenv from 'dotenv';
import Server from './server';
// Configurar DotENV
dotenv.config();
const server = new Server();
server.listen();