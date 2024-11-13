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

export default router