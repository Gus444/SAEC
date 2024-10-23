import path from 'path'; // Para validar extensões de arquivos
import DocsProtocoloModel from "../Models/docsProtocoloModel.js";

export default class docsProtocoloController {

    async cadastrarDocsProtocolo(req, res) {
        try {
            // Verifique se o body e o arquivo existem
            if (req.body && req.file) {
                // Extraia o ID
                let { protocolo } = req.body;
                
                // Extraia o nome do arquivo da requisição
                let protDocsNome = req.file.filename;

                // Valide se a é válida e o arquivo tem uma extensão permitida
                const extensaoArquivo = path.extname(req.file.filename);
                if (protocolo > 0 && (extensaoArquivo === ".jpg" || extensaoArquivo === ".png" || extensaoArquivo === ".pdf" || extensaoArquivo === ".jpeg")) {

                    let docsProtocolo = new DocsProtocoloModel();
                    docsProtocolo.protDocsId = 0; // O ID será gerado automaticamente
                    docsProtocolo.protId = protocolo; // Associe o ID que foi passada no body
                    docsProtocolo.protDocsNome = protDocsNome; // Nome do arquivo

                    // Gravação no banco de dados
                    let result = await docsProtocolo.gravar();
                    if (result) {
                        res.status(201).json({ msg: "Documento cadastrado com sucesso!" });
                    } else {
                        res.status(500).json({ msg: "Erro interno de servidor!" });
                    }

                } else {
                    res.status(400).json({ msg: "Por favor, preencha todas as informações corretamente e envie um arquivo válido." });
                }
            } else {
                res.status(400).json({ msg: "Por favor, informe os dados e o arquivo do registro." });
            }
        } catch (ex) {
            res.status(500).json({
                msg: "Erro interno de servidor!",
                detalhes: ex.message
            });
        }
    }

    async obter(req, res) {
        try {
            let { id } = req.params;
            let docs = new DocsProtocoloModel();
            let docsEncontrados = await docs.obterDocs(id);
            if (docsEncontrados != null) {
                res.status(200).json({docsEncontrados});
            } else {
                res.status(404).json({ msg: "Registro não encontrado" });
            }
        } catch (error) {
            res.status(500).json({ msg: "Erro de servidor", detalhes: error.message });
        }
    }

}