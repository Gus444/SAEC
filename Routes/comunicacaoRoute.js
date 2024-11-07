import express from 'express'
import ComunicacaoController from '../Controllers/comunicacaoController.js';
import Autenticar from '../middlewares/autenticar.js';

let router = express.Router();

let ctrl = new ComunicacaoController();
let auth = new Autenticar();

router.get('/', auth.validar, (req,res) =>{
    // #swagger.tags = ['Comunicacao']
    // #swagger.summary = 'Lista de Comunicacoes'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.listarComunicacao(req,res)
})
router.get('/:id', auth.validar, (req,res) => {
    // #swagger.tags = ['Comunicacao']
    // #swagger.summary = 'Lista de Comunicacoes por empresa'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.listarComunicacaoPorEmpresa(req,res)
})
router.post('/', auth.validar, (req,res) =>{
    // #swagger.tags = ['Comunicacao']
    // #swagger.summary = 'Cadastrar comunicacao'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/comunicacaoModel"
                }
            }
            
        }
    }*/
    ctrl.cadastrarComunicacao(req,res);
});
router.get('/obter/:id', auth.validar, (req,res) => {
    // #swagger.tags = ['Comunicacao']
    // #swagger.summary = 'Retorna baseado em um id'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.obterComunicacao(req, res);
})
router.delete('/excluir/:id', auth.validar, (req,res) => {
    // #swagger.tags = ['Comunicacao']
    // #swagger.summary = 'Retorna baseado em um id'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.excluirComunicacao(req, res);
});
router.put('/', auth.validar, (req,res) =>{
    // #swagger.tags = ['Comunicacao']
    // #swagger.summary = 'Alterar Comunicação'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
   ctrl.alterarComunicacao(req,res);
});

export default router