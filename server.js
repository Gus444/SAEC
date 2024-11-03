import { createRequire } from "module"
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import usuarioRoute from './Routes/usuarioRoute.js'
import loginRouter from './Routes/loginRoute.js'
import empresaRouter from './Routes/empresaRoute.js'
import comunicacaoRouter from './Routes/comunicacaoRoute.js'
import docsComunicacaoRouter from './Routes/docsComunicacaoRoute.js'
import protocoloRouter from './Routes/protocoloRoute.js'
import docsProtocoloRouter from './Routes/docsProtocoloRoute.js'
import faturamentoRouter from './Routes/faturamentoRoute.js'
import competenciaRouter from './Routes/competenciaRoute.js'
import tipoDespesaRouter from './Routes/tipoDespesaRoute.js'

const outputJson = require("./swagger-output.json");

const app = express();
app.use(cookieParser());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

app.use(cors({origin: "http://localhost:3000", credentials:true}))

app.use('/docs', swaggerUi.serve, swaggerUi.setup(outputJson));//pagina docs swagger

app.use('/usuarios', usuarioRoute);
app.use('/login', loginRouter);
app.use('/empresa', empresaRouter);
app.use('/comunicacao', comunicacaoRouter);
app.use('/docsComunicacao', docsComunicacaoRouter);
app.use('/protocolo', protocoloRouter);
app.use('/docsProtocolo', docsProtocoloRouter);
app.use('/faturamento', faturamentoRouter);
app.use('/competencia', competenciaRouter);
app.use('/tipoDespesa', tipoDespesaRouter);



global.COMUNICACAO_IMG_CAMINHO = "http://localhost:5000/img/Comunicacao/";
global.PROTOCOLO_IMG_CAMINHO = "http://localhost:5000/img/Protocolo/"

global.RAIZ_PROJETO = __dirname

app.listen(5000, function() {
    console.log("backend em execução");
})