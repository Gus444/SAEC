import express from 'express'
import Autenticar from '../middlewares/autenticar.js';
import docsComunicacaoController from '../Controllers/docsComunicacaoController.js';
import multer from 'multer';
import path from "path";

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
let upload = multer({storage,
    fileFilter: (req, file, cb) => {
        const tiposPermitidos = /jpeg|jpg|png|pdf/; // Tipos permitidos
        const extensaoValida = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
        const tipoMimeValido = tiposPermitidos.test(file.mimetype);

        if (extensaoValida && tipoMimeValido) {
            return cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo não suportado!'));
        }
    }
});


router.post('/', auth.validar, upload.single("inputImage"), (req,res) =>{
    // #swagger.tags = ['Documentos Comunicacao']
    // #swagger.summary = 'Cadastrar Imagem Comunicacao'
    
    ctrl.cadastrarDocsComunicacao(req,res);
});
router.get('/obter/:id', auth.validar, (req,res) => {
    // #swagger.tags = ['Documentos Comunicacao']
    // #swagger.summary = 'Retorna baseado em um id'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.obter(req, res);
})

export default router;