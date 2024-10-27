import express from 'express'
import Autenticar from '../middlewares/autenticar.js'
import CompetenciaController from '../Controllers/competenciaController.js';

let router = express.Router();

let ctrl = new CompetenciaController();
let auth = new Autenticar();

router.post('/', auth.validar, (req,res) =>{
    // #swagger.tags = ['Faturamento']
    // #swagger.summary = 'Cadastrar Faturamento'
    ctrl.cadastrar(req,res);
})
export default router