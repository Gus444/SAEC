import express from 'express'
import Autenticar from '../middlewares/autenticar.js';
import multer from 'multer';
import path from "path";
import docsProtocoloController from '../Controllers/docsProtocoloController.js';

let router = express.Router();

let ctrl = new docsProtocoloController();
let auth = new Autenticar();

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/img/Protocolo');
    },
    filename: function(req, file, cb) {
        // Obtenha a extensão do arquivo
        const ext = path.extname(file.originalname).toLowerCase();
        
        // Remove caracteres especiais do nome do arquivo
        const sanitizedFilename = file.originalname
            .split('.')[0]
            .normalize("NFD") // Normaliza acentos e outros caracteres
            .replace(/[\u0300-\u036f]/g, '') // Remove marcas diacríticas
            .replace(/[^a-zA-Z0-9]/g, '0'); // Substitui caracteres especiais por '_'

        // Gera um novo nome único
        cb(null, `${sanitizedFilename}_${Date.now()}${ext}`);
    }
});

let upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const tiposPermitidos = /jpeg|jpg|png|pdf|docx/; // Tipos permitidos (incluindo .docx)
        const extensaoValida = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
        const tipoMimeValido = tiposPermitidos.test(file.mimetype) || 
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; // Tipo MIME para .docx

        if (extensaoValida && tipoMimeValido) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo não suportado!'));
        }
    }
});


router.post('/', auth.validar, upload.array("inputImage"), (req,res) =>{
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