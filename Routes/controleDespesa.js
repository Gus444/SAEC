import express from 'express'
import Autenticar from '../middlewares/autenticar.js';
import DespesaController from '../Controllers/despesaController.js';


let router = express.Router();

let ctrl = new DespesaController()
let auth = new Autenticar();

router.post('/', auth.validar, (req,res) =>{
    // #swagger.tags = ['Controle de despesa']
    // #swagger.summary = 'Cadastrar uma despesa'
    ctrl.cadastrar(req,res);
});
router.get('/:id', auth.validar, (req,res) => {
    // #swagger.tags = ['Controle de despesa']
    // #swagger.summary = 'Listar despesas'
    ctrl.listarDespesasEmp(req,res);
});
router.get('/obter/:ano/:empresa', auth.validar, (req,res) =>{
    // #swagger.tags = ['Controle de despesa']
    // #swagger.summary = 'Obter Meses das despesas'
    ctrl.listarMeses(req,res);
});
router.get('/obter/:ano/:empresa/:mes', auth.validar, (req,res) =>{
    // #swagger.tags = ['Controle de despesa']
    // #swagger.summary = 'Obter as despesas'
    ctrl.listarDespesasMes(req,res);
});
router.delete('/excluirAno/:ano/:empresa', auth.validar, (req,res) => {
    // #swagger.tags = ['Controle de despesa']
    // #swagger.summary = 'Deletar o ano completo de uma despesa'
    ctrl.excluirAno(req,res);
});
router.get('/obterDespesa/:ano/:empresa/:mes/:id', auth.validar, (req,res) => {
    // #swagger.tags = ['Controle de despesa']
    // #swagger.summary = 'Obter os dados para alteração'
    ctrl.listarDespesaEspecifica(req,res);
})
router.put('/alterarDespesaEsp/', auth.validar, (req,res) =>{
    // #swagger.tags = ['Controle de despesa']
    // #swagger.summary = 'Alterar despesa especifica de um ano em um mes'
    ctrl.alterarDespesaEsp(req,res);
});
router.delete("/excluir/:id", auth.validar, (req,res) => {
    // #swagger.tags = ['Controle de despesa']
    // #swagger.summary = 'Deletar uma despesa especifica'
    ctrl.deletarDespesaEspecifica(req,res);
});

export default router