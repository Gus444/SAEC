import express from 'express'
import Autenticar from '../middlewares/autenticar.js';
import docsComunicacaoController from '../Controllers/docsComunicacaoController.js';
import multer from 'multer';

let router = express.Router();

let ctrl = new docsComunicacaoController();
let auth = new Autenticar();

let storage = multer.diskStorage({
    destination: function(req, res, cb) {
        cb(null, 'public/img/Comunicacao');
    },
    filename: function(req, file, cb) {
        var ext = file.originalname.split(".")[1];
        cb(null, Date.now().toString() + "." + ext);
    }
})
let upload = multer({storage})

router.post('/', auth.validar, upload.single("inputImage"), (req,res) =>{
    // #swagger.tags = ['Documentos Comunicacao']
    // #swagger.summary = 'Cadastrar Imagem Comunicacao'
    
    ctrl.cadastrarDocsComunicacao(req,res);
});

export default router