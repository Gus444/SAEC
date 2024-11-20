import path from 'path'; // Para validar extensões de arquivos
import DocsProtocoloModel from "../Models/docsProtocoloModel.js";

export default class docsProtocoloController {
    
    async cadastrarDocsProtocolo(req, res) {//isso precisaria ser na controller do protocolo
        try {
            if (req.body && req.files) {
                let { protocolo } = req.body;
                
                if (protocolo > 0) {
                    const extensoesPermitidas = [".jpg", ".jpeg", ".png", ".pdf"];
                    const erros = [];
    
                    for (const file of req.files) {
                        let protDocsNome = file.filename; 
                        const extensaoArquivo = path.extname(file.filename);
    
                        if (extensoesPermitidas.includes(extensaoArquivo)) {
                            let docsProtocolo = new DocsProtocoloModel();
                            docsProtocolo.protDocsId = 0; 
                            docsProtocolo.protId = protocolo;
                            docsProtocolo.protDocsNome = protDocsNome;
    
                            const result = await docsProtocolo.gravar();
                            if (!result) {
                                erros.push(`Erro ao gravar o documento: ${protDocsNome}`);
                            }
                        } else {
                            erros.push(`Arquivo ${protDocsNome} tem uma extensão não permitida.`);
                        }
                    }
    
                    if (erros.length > 0) {
                        return res.status(400).json({ msg: "Ocorreram erros no cadastro de alguns documentos.", erros });
                    }
                    
                    res.status(201).json({ msg: "Documentos cadastrados com sucesso!" });
                } else {
                    res.status(400).json({ msg: "Comunicação inválida." });
                }
            } else {
                res.status(400).json({ msg: "Nenhuma comunicação ou arquivo enviado." });
            }
        } catch (ex) {
            console.error(ex); // Log de erro para depuração
            res.status(500).json({
                msg: "Erro interno de servidor!",
                detalhes: ex.message
            });
        }
    }

    async alterarDocsProtocolo(req,res){
        try {
            if (req.body && req.files) {
                let { protocolo } = req.body;
                
                if (protocolo > 0) {
                    const extensoesPermitidas = [".jpg", ".jpeg", ".png", ".pdf"];
                    const erros = [];
    
                    for (const file of req.files) {
                        let protDocsNome = file.filename; 
                        const extensaoArquivo = path.extname(file.filename);
    
                        if (extensoesPermitidas.includes(extensaoArquivo)) {
                            let docsProtocolo = new DocsProtocoloModel();
                            docsProtocolo.protDocsId = 0; 
                            docsProtocolo.protId = protocolo;
                            docsProtocolo.protDocsNome = protDocsNome;
    
                            const result = await docsProtocolo.gravar();
                            if (!result) {
                                erros.push(`Erro ao gravar o documento: ${protDocsNome}`);
                            }
                        } else {
                            erros.push(`Arquivo ${protDocsNome} tem uma extensão não permitida.`);
                        }
                    }
    
                    if (erros.length > 0) {
                        return res.status(400).json({ msg: "Ocorreram erros no cadastro de alguns documentos.", erros });
                    }
                    
                    res.status(201).json({ msg: "Documentos cadastrados com sucesso!" });
                } else {
                    res.status(400).json({ msg: "Comunicação inválida." });
                }
            } else {
                res.status(400).json({ msg: "Nenhuma comunicação ou arquivo enviado." });
            }
        } catch (ex) {
            console.error(ex); // Log de erro para depuração
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
            if (docsEncontrados && docsEncontrados.length > 0) {
                res.status(200).json({ docsEncontrados });
            } else {
                res.status(404).json({ msg: "Registro não encontrado" });
            }
        } catch (error) {
            console.error(error); // Log de erro para depuração
            res.status(500).json({ msg: "Erro de servidor", detalhes: error.message });
        }
    }

    async deletar(req,res){
        try {
            let { id } = req.params;
            let docs = new DocsProtocoloModel();
            let docEncontrado = await docs.obterDocExc(id)
            if (docEncontrado) {
                let result = await docs.deletarDocumentoEspecifico(id);

                if(result){
                    res.status(200).json({msg:"Exclusão efetuada com sucesso"});
                }
                else{
                    res.status(500).json({msg:"Erro ao excluir o arquivo"});
                }
            } else {
                res.status(404).json({ msg: "Registro não encontrado" });
            }
        } catch (error) {
            console.error(error); // Log de erro para depuração
            res.status(500).json({ msg: "Erro de servidor", detalhes: error.message });
        }
    }
}