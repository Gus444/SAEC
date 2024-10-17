import express from 'express'
import UsuarioController from '../Controllers/usuarioController.js';
import Autenticar from '../middlewares/autenticar.js';

let router = express.Router();

let ctrl = new UsuarioController();
let auth = new Autenticar();

router.get('/', auth.validar, (req,res) => {
    // #swagger.tags = ['Usuários']
    // #swagger.summary = 'Lista os usuários cadastrados'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.listarUsuario(req, res);
})
router.get('/obter/:id', auth.validar, (req,res) => {
    // #swagger.tags = ['Usuários']
    // #swagger.summary = 'Retorna um usuário baseado em um id'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.obterUsuario(req, res);
})
router.post('/', auth.validar, (req,res) =>{
    // #swagger.tags = ['Usuários']
    // #swagger.summary = 'Cadastrar um usuario'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/usuarioModel"
                }
            }
            
        }
    }*/
    ctrl.cadastrarUsuario(req,res);
});
router.delete('/excluir/:id', auth.validar,(req,res) =>{
    // #swagger.tags = ['Usuários']
    // #swagger.summary = 'Excluir um usuario por id' 
    /* #swagger.security = [{
            "bearerAuth": []
    }] */ 
   ctrl.excluirUsuario(req,res);
})


export default router;