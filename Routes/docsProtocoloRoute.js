import express from 'express'
import Autenticar from '../middlewares/autenticar.js';
import multer from 'multer';
import path from "path";
import docsProtocoloController from '../Controllers/docsProtocoloController.js';

let router = express.Router();

let ctrl = new docsProtocoloController();
let auth = new Autenticar();

let storage = multer.diskStorage({
    destination: function(req, res, cb) {
        cb(null, 'public/img/Protocolo');
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
    // #swagger.tags = ['Documentos Protocolo']
    // #swagger.summary = 'Cadastrar Imagem Protocolo'
    
    ctrl.cadastrarDocsProtocolo(req,res);
});
router.get('/obter/:id', auth.validar, (req,res) => {
    // #swagger.tags = ['Documentos Protocolo']
    // #swagger.summary = 'Retorna baseado em um id'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.obter(req, res);
})

export default router;