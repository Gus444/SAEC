import DocsComunicacaoModel from "../Models/docsComunicacaoModel.js";
import path from 'path'; // Para validar extensões de arquivos

export default class docsComunicacaoController {

    async cadastrarDocsComunicacao(req, res) {
        try {
            // Verifique se o body e os arquivos existem
            if (req.body && req.files) {
                // Extraia o ID da comunicação
                let { comunicacao } = req.body;
                
                // Verifique se a comunicação é válida
                if (comunicacao > 0) {
                    const extensoesPermitidas = [".jpg", ".jpeg", ".png", ".pdf"];
    
                    // Processar cada arquivo enviado
                    for (const file of req.files) {
                        let comDocsNome = file.filename; // Nome do arquivo
                        const extensaoArquivo = path.extname(file.filename);
    
                        // Valide a extensão do arquivo
                        if (extensoesPermitidas.includes(extensaoArquivo)) {
                            let docsComunicacao = new DocsComunicacaoModel();
                            docsComunicacao.comDocsId = 0; // O ID será gerado automaticamente
                            docsComunicacao.comunicacaoId = comunicacao; // Associe o ID da comunicação
                            docsComunicacao.comDocsNome = comDocsNome; // Nome do arquivo
    
                            // Gravação no banco de dados
                            let result = await docsComunicacao.gravar();
                            if (!result) {
                                return res.status(500).json({ msg: "Erro interno de servidor ao gravar o documento." });
                            }
                        } else {
                            return res.status(400).json({ msg: `Arquivo ${comDocsNome} tem uma extensão não permitida.` });
                        }
                    }
                    res.status(201).json({ msg: "Documentos cadastrados com sucesso!" });
                } else {
                    res.status(400).json({ msg: "Comunicação inválida." });
                }
            } else {
                res.status(400).json({ msg: "Nenhuma comunicação ou arquivo enviado." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro interno de servidor." });
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