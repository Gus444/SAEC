import DocsComunicacaoModel from "../Models/docsComunicacaoModel.js";
import path from 'path'; // Para validar extensões de arquivos

export default class docsComunicacaoController {

    async cadastrarDocsComunicacao(req, res) {
        try {
            // Verifique se o body e o arquivo existem
            if (req.body && req.file) {
                // Extraia o ID da comunicação
                let { comunicacao } = req.body;
                
                // Extraia o nome do arquivo da requisição
                let comDocsNome = req.file.filename;

                // Valide se a comunicação é válida e o arquivo tem uma extensão permitida
                const extensaoArquivo = path.extname(req.file.filename);
                if (comunicacao > 0 && (extensaoArquivo === ".jpg" || extensaoArquivo === ".png" || extensaoArquivo === ".pdf" || extensaoArquivo === ".jpeg")) {

                    let docsComunicacao = new DocsComunicacaoModel();
                    docsComunicacao.comDocsId = 0; // O ID será gerado automaticamente
                    docsComunicacao.comunicacaoId = comunicacao; // Associe o ID da comunicação que foi passada no body
                    docsComunicacao.comDocsNome = comDocsNome; // Nome do arquivo

                    // Gravação no banco de dados
                    let result = await docsComunicacao.gravar();
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
            let docs = new DocsComunicacaoModel();
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