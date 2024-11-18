import DocsProtocoloModel from "../Models/docsProtocoloModel.js";
import EmpresaModel from "../Models/empresaModel.js";
import ProtocoloModel from "../Models/protocoloModel.js";
import UsuarioModel from "../Models/usuarioModel.js";

export default class ProtocoloController{

    async listarProtocolo(req,res){
        try {
            let protocolo = new ProtocoloModel();
            let listaProtocolo = await protocolo.listar()
            res.status(200).json(listaProtocolo)
        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

    async listarProtocoloPorEmpresa(req,res){
        try {
            let { id } = req.params;
            let protocolo = new ProtocoloModel();
            let listaProtocolo = await protocolo.listarPorEmpresa(id)
            res.status(200).json(listaProtocolo)

        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

    async cadastrarProtocolo(req, res) {
        try{
            if(req.body) {
                let { protTitulo, protTipo, protData, protDescricao, usuario, empresa} = req.body;
                if(protTitulo != "" && protTipo != "" && protData != "" && protDescricao != "" && usuario > 0, empresa > 0){

                    let protocolo = new ProtocoloModel();
                    protocolo.protId = 0;
                    protocolo.protTitulo = protTitulo;
                    protocolo.protTipo = protTipo;
                    protocolo.protData = protData;
                    protocolo.protDescricao = protDescricao;
                    protocolo.usuario = new UsuarioModel(usuario);
                    protocolo.empresa = new EmpresaModel(empresa);

                    let result = await protocolo.gravarProtocolo();
                    if(result) {
                        res.status(201).json({msg: "Protocolo cadastrada com sucesso!", result});    
                    }
                    else{
                        res.status(500).json({msg: "Erro interno de servidor!"})
                    }
                          
                }
                else {
                    res.status(400).json({msg: "Por favor, preencha todas as informações"})
                }
            }
            else {
                res.status(400).json({msg: "Por favor, informe os dados do registro"})
            }
        }
        catch(ex) {
            res.status(500).json(
                {msg: "Erro interno de servidor!",
                detalhes: ex.message})
        
        }
        
    }

    // async cadastrarProtocoloComDocs(req, res) {
    //     try {
    //         if (!req.body) {
    //             return res.status(400).json({ msg: "Por favor, informe os dados do registro" });
    //         }
    
    //         // 1. Validação dos dados do protocolo
    //         let { protTitulo, protTipo, protData, protDescricao, usuario, empresa } = req.body;
    
    //         if (!protTitulo || !protTipo || !protData || !protDescricao || usuario <= 0 || empresa <= 0) {
    //             return res.status(400).json({ msg: "Por favor, preencha todas as informações" });
    //         }
    
    //         // 2. Criação do protocolo
    //         let protocolo = new ProtocoloModel();
    //         protocolo.protId = 0;
    //         protocolo.protTitulo = protTitulo;
    //         protocolo.protTipo = protTipo;
    //         protocolo.protData = protData;
    //         protocolo.protDescricao = protDescricao;
    //         protocolo.usuario = new UsuarioModel(usuario);
    //         protocolo.empresa = new EmpresaModel(empresa);
    
    //         let protocoloResult = await protocolo.gravarProtocolo();
    
    //         if (!protocoloResult) {
    //             return res.status(500).json({ msg: "Erro ao gravar o protocolo!" });
    //         }
    
    //         // 3. Verificação de arquivos para documentos do protocolo
    //         const arquivos = req.files;
    //         const extensoesPermitidas = [".jpg", ".jpeg", ".png", ".pdf"];
    //         const erros = [];
    
    //         if (arquivos && arquivos.length > 0) {
    //             for (const file of arquivos) {
    //                 const protDocsNome = file.filename;
    //                 const extensaoArquivo = path.extname(file.filename);
    
    //                 // Validação de extensão
    //                 if (extensoesPermitidas.includes(extensaoArquivo)) {
    //                     const docsProtocolo = new DocsProtocoloModel();
    //                     docsProtocolo.protDocsId = 0;
    //                     docsProtocolo.protId = protocoloResult.id; // Relacionar ao protocolo recém-criado
    //                     docsProtocolo.protDocsNome = protDocsNome;
    
    //                     const docsResult = await docsProtocolo.gravar();
    
    //                     if (!docsResult) {
    //                         erros.push(`Erro ao gravar o documento: ${protDocsNome}`);
    //                     }
    //                 } else {
    //                     erros.push(`Arquivo ${protDocsNome} tem uma extensão não permitida.`);
    //                 }
    //             }
    //         }
    
    //         // 4. Responder com os resultados
    //         if (erros.length > 0) {
    //             return res.status(400).json({ 
    //                 msg: "Protocolo cadastrado, mas ocorreram erros no cadastro de alguns documentos.", 
    //                 erros 
    //             });
    //         }
    
    //         return res.status(201).json({ 
    //             msg: "Protocolo e documentos cadastrados com sucesso!", 
    //             protocoloId: protocoloResult.id 
    //         });
    
    //     } catch (ex) {
    //         console.error("Erro interno:", ex);
    //         return res.status(500).json({
    //             msg: "Erro interno de servidor!",
    //             detalhes: ex.message,
    //         });
    //     }
    // }

    async obterProtocolo(req, res) {
        try {
            let { id } = req.params;
            let protocolo = new ProtocoloModel();
            let protocoloEncontrado = await protocolo.obter(id);
            if (protocoloEncontrado != null) {
                res.status(200).json(protocoloEncontrado);
            } else {
                res.status(404).json({ msg: "Registro não encontrado" });
            }
        } catch (error) {
            res.status(500).json({ msg: "Erro de servidor", detalhes: error.message });
        }
    }
    
        async excluirProtocolo(req,res){
            try {
                let protocolo = new ProtocoloModel();
                let docsProtocolo = new DocsProtocoloModel();
                let { id } = req.params;
                if(await protocolo.obter(id) != null){
                    let despesaProt = await protocolo.verificarProtocoloDesp(id);
                    if(despesaProt == false){
                        if(await docsProtocolo.obter(id) != null){
                            let result = await docsProtocolo.deletarDocsProtocolo(id);
                            if(result){
                                let result = await protocolo.deletarProtocolo(id);
                                if(result){
                                    res.status(200).json({msg:"Documentos excluidos com sucesso"});
                                }
                                else{
                                    res.status(400).json({msg:"Falha ao deletar documentos"})
                                }
                            }
                            else{
                                res.status(400).json({msg:"Falha ao deletar este registro"})
                            }
                        }
                        else{
                            let result = await protocolo.deletarProtocolo(id);
                            if(result){
                                res.status(200).json({msg:"Documentos excluidos com sucesso"});
                            }
                            else{
                                res.status(400).json({msg:"Erro ao deletar este registro"})
                            }  
                        }
                    }
                    else{
                        res.status(400).json({msg:"Não é possivel apagar este protocolo pois ele esta em uso em uma despesa"})
                    }
                }
                else{
                    res.status(404).json({msg:"Protocolo não encontrado"})
                }
            } catch (error) {
                res.status(500).json({msg:"Erro de servidor", detalhes: error.message})
            }
        }

        async alterarProtocolo(req, res) {
            try {
                if (req.body) {
                    let { protId, protTitulo, protTipo , protData, protDescricao, usuario, empresa} = req.body;
                    
                    if (protId && protTitulo && protTipo && protData && protDescricao && usuario > 0 && empresa > 0) {
                        
                        let protocolo = new ProtocoloModel(protId, protTitulo, protTipo, protData, protDescricao, usuario, empresa);
                        
                        if (await protocolo.obter(protId) != null) {
                                    
                            let result = await protocolo.gravarProtocolo();
                            if (result) {
                                res.status(201).json({ msg: "Protocolo atualizada com sucesso!", result});
                            } else {
                                res.status(500).json({ msg: "Erro interno de servidor"});
                            }
                        
                        } else {
                            res.status(404).json({ msg: "Protocolo não encontrado para alteração" });
                        }
                    } else {
                        res.status(400).json({ msg: "Existem campos que não foram preenchidos!" });
                    }
                } else {
                    res.status(400).json({ msg: "Preencha corretamente os dados do registro!" });
                }
            } catch (ex) {
                res.status(500).json({
                    msg: "Erro inesperado! Entre em contato com o nosso suporte técnico.",
                    detalhes: ex.message
                });
            }
        }
}