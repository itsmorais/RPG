import express from 'express'
import dotenv from 'dotenv'
import { createRoutes } from './routes/index.routes';
dotenv.config();

const server = express();
server.use(express.json());
createRoutes(server);


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);

});
