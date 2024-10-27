import express from 'express'
import FaturamentoController from '../Controllers/faturamentoController.js'
import Autenticar from '../middlewares/autenticar.js'

let router = express.Router();

let ctrl = new FaturamentoController();
let auth = new Autenticar();

router.post('/', auth.validar, (req,res) =>{
    // #swagger.tags = ['Faturamento']
    // #swagger.summary = 'Cadastrar Faturamento'
    ctrl.cadastrar(req,res);
})
router.get('/:id', auth.validar, (req,res) => {
    // #swagger.tags = ['Faturamento']
    // #swagger.summary = 'Listar faturamento'
    ctrl.listarFaturamentoPorEmpresa(req,res);
})
router.get('/obter/:ano/:empresa', auth.validar, (req,res) =>{
    // #swagger.tags = ['Faturamento']
    // #swagger.summary = 'Obter faturamento'
    ctrl.obterFaturamento(req,res);
})
router.put('/:empresa/:ano', auth.validar,(req,res) =>{
     // #swagger.tags = ['Faturamento']
    // #swagger.summary = 'Alterar faturamento'
    ctrl.alterar(req,res);
})
router.delete('/:id', auth.validar,(req,res) =>{
    // #swagger.tags = ['Faturamento']
   // #swagger.summary = 'excluir faturamento'
   ctrl.excluir(req,res);
})
export default router