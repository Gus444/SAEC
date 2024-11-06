import express from 'express'
import EmpresaController from '../Controllers/empresaController.js'
import Autenticar from '../middlewares/autenticar.js';


let router = express.Router();

let ctrl = new EmpresaController();
let auth = new Autenticar();

router.get('/', auth.validar, (req,res) =>{
    // #swagger.tags = ['Empresa']
    // #swagger.summary = 'Lista de empresas do sistema'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.listarEmpresas(req,res)
})
router.delete('/excluir/:id', auth.validar,(req,res) =>{
    // #swagger.tags = ['Empresa']
    // #swagger.summary = 'Excluir uma empresa por id' 
    /* #swagger.security = [{
            "bearerAuth": []
    }] */ 
   ctrl.excluirEmpresa(req,res);
})
router.post('/', auth.validar, (req,res) =>{
    // #swagger.tags = ['Empresa']
    // #swagger.summary = 'Cadastrar uma empresa'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/empresaModel"
                }
            }
            
        }
    }*/
    ctrl.cadastrarEmpresa(req,res);
});
router.get('/obterAcesso/:id', auth.validar, (req,res) => {
    // #swagger.tags = ['Empresa']
    // #swagger.summary = 'Retorna uma empresa baseado em um id'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.obterEmpresaAcesso(req, res);
})
router.get('/obter/:id', auth.validar, (req,res) => {
    // #swagger.tags = ['Empresa']
    // #swagger.summary = 'Retorna uma empresa baseado em um id'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.obterEmpresa(req, res);
})
router.put('/', auth.validar, (req,res) =>{
    // #swagger.tags = ['Empresa']
    // #swagger.summary = 'Alterar uma empresa'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/empresaModel"
                }
            }
            
        }
    }*/
    ctrl.alterarEmpresa(req,res);
});
router.get('/buscar', auth.validar, (req,res) => {
    // #swagger.tags = ['Empresa']
    // #swagger.summary = 'Buscar por nome'
    ctrl.buscar(req,res)
})


export default router