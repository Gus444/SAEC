import express from 'express'
import Autenticar from '../middlewares/autenticar.js';
import tipoDespesaController from '../Controllers/tipoDespesaController.js';

let router = express.Router();

let ctrl = new tipoDespesaController;
let auth = new Autenticar();

router.get('/', auth.validar, (req,res) => {
    // #swagger.tags = ['Tipo Despesa']
    // #swagger.summary = 'Lista tipo despesa cadastrados'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.listarTipoDespesa(req, res);
})
router.get('/obter', auth.validar, (req,res) => {
    // #swagger.tags = ['Tipo Despesa']
    // #swagger.summary = 'Retorna um tipo de despesa baseado em um id'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.obterTipoDespesa(req, res);
})
router.post('/', auth.validar, (req,res) =>{
    // #swagger.tags = ['Tipo Despesa']
    // #swagger.summary = 'Cadastrar um tipo de despesa'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/tipoDespesa"
                }
            }
            
        }
    }*/
    ctrl.cadastrarTipoDespesa(req,res);
});
router.delete('/excluir/:id', auth.validar,(req,res) =>{
    // #swagger.tags = ['Tipo Despesa']
    // #swagger.summary = 'Excluir por id' 
    /* #swagger.security = [{
            "bearerAuth": []
    }] */ 
   ctrl.excluirTipoDespesa(req,res);
});

export default router