import express from 'express'
import Autenticar from '../middlewares/autenticar.js';
import ProtocoloController from '../Controllers/protocoloController.js';

let router = express.Router();

let ctrl = new ProtocoloController()
let auth = new Autenticar();

router.get('/', auth.validar, (req,res) =>{
    // #swagger.tags = ['Protocolo']
    // #swagger.summary = 'Lista de Protocolos'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.listarProtocolo(req,res)
})
router.get('/:id', auth.validar, (req,res) => {
    // #swagger.tags = ['Protocolo']
    // #swagger.summary = 'Lista de Protocolos por empresa'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.listarProtocoloPorEmpresa(req,res)
})
router.post('/', auth.validar, (req,res) =>{
    // #swagger.tags = ['Protocolo']
    // #swagger.summary = 'Cadastrar protocolo'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/protocoloModel"
                }
            }
            
        }
    }*/
    ctrl.cadastrarProtocolo(req,res);
});
router.get('/obter/:id', auth.validar, (req,res) => {
    // #swagger.tags = ['Protocolo']
    // #swagger.summary = 'Retorna baseado em um id'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.obterProtocolo(req, res);
})
router.delete('/excluir/:id', auth.validar, (req,res) => {
    // #swagger.tags = ['Protocolo']
    // #swagger.summary = 'Excluir baseado em um id'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.excluirProtocolo(req, res);
})

export default router