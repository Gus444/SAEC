import swaggerAutogen from "swagger-autogen";
import UsuarioModel from "./Models/usuarioModel.js";
import LoginModel from "./Models/loginModel.js";
import EmpresaModel from "./Models/empresaModel.js";

const doc = {
    info: {
        tittle: "SAEC - API",
        description: "API feita para o sistema SAEC"
    },
    host: 'localhost:5000',
    components:{
        securitySchemes:{
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        },
        schemas:{
            loginModel: new LoginModel("gustttavosilvasouza44@gmail.com", "admin12345").toJSON(),
            usuarioModel: new UsuarioModel(0, "Teste", "teste@email.com", "teste123", "18999999999", 0, 0).toJSON(),
            empresaModel: new EmpresaModel(0, )
        }
    } 
}

const outputJson = "./swagger-output.json";
const routes = ['./server.js'];

swaggerAutogen({openapi: '3.0.0'})(outputJson, routes, doc)
.then( async () => {
    await import('./server.js');
})