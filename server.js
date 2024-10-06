import { createRequire } from "module"
const require = createRequire(import.meta.url);

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import usuarioRoute from './Routes/usuarioRoute.js'
import loginRouter from './Routes/loginRoute.js'
import empresaRouter from './Routes/empresaRoute.js'

const outputJson = require("./swagger-output.json");

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(cors({origin: "http://localhost:3000", credentials:true}))

app.use('/docs', swaggerUi.serve, swaggerUi.setup(outputJson));//pagina docs swagger

app.use('/usuarios', usuarioRoute);
app.use('/login', loginRouter);
app.use('/empresa', empresaRouter)


app.listen(5000, function() {
    console.log("backend em execução");
})