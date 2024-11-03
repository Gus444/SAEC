import swaggerAutogen from "swagger-autogen";
import UsuarioModel from "./Models/usuarioModel.js";
import LoginModel from "./Models/loginModel.js";
import EmpresaModel from "./Models/empresaModel.js";
import ComunicacaoModel from "./Models/comunicacaoModel.js";
import TipoDespesaModel from "./Models/tipoDespesaModel.js";

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
            empresaModel: new EmpresaModel(0, "11018395000176", "testeEmpresa", "regimeTeste", "IeTeste", "(18) 99999-9999", 
            "TesteDescricao", "TesteResp", "TesteProp", new Date(), new Date(), "teste@teste", "testeEnd", "testeBairro", 
            "TesteCid", "TesteCep", "TesteUf").toJSON(),
            comunicacaoModel: new ComunicacaoModel(0, "TesteTitulo", "TesteCanal", "testeData", "testeHora", "TesteDescricao", 
            new UsuarioModel(1), new EmpresaModel(1)).toJSON(),
            tipoDespesa: new TipoDespesaModel(0, "Nome do tipo da despesa").toJSON()
        }
    } 
}

const outputJson = "./swagger-output.json";
const routes = ['./server.js'];

swaggerAutogen({openapi: '3.0.0'})(outputJson, routes, doc)
.then( async () => {
    await import('./server.js');
})