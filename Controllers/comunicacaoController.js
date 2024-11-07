import ComunicacaoModel from "../Models/comunicacaoModel.js";
import DocsComunicacaoModel from "../Models/docsComunicacaoModel.js";
import EmpresaModel from "../Models/empresaModel.js";
import UsuarioModel from "../Models/usuarioModel.js";


export default class ComunicacaoController{


    async listarComunicacao(req,res){
        try {
            let comunicacao = new ComunicacaoModel();
            let listaComunicacao = await comunicacao.listar()
            res.status(200).json(listaComunicacao)
        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

    async listarComunicacaoPorEmpresa(req,res){
        try {
            let { id } = req.params;
            let comunicacao = new ComunicacaoModel();
            let listaComunicacao = await comunicacao.listarPorEmpresa(id)
            res.status(200).json(listaComunicacao)

        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

    async cadastrarComunicacao(req, res) {
        try{
            if(req.body) {
                let { comTitulo, comCanal, comData, comHora, comDescricao, usuario, empresa} = req.body;
                if(comTitulo != "" && comCanal != "" && comData != "" && comHora != "" && usuario > 0, empresa > 0){

                    let comunicacao = new ComunicacaoModel();
                    comunicacao.comId = 0;
                    comunicacao.comTitulo = comTitulo;
                    comunicacao.comCanal = comCanal;
                    comunicacao.comData = comData;
                    comunicacao.comHora = comHora;
                    comunicacao.comDescricao = comDescricao;
                    comunicacao.usuario = new UsuarioModel(usuario);
                    comunicacao.empresa = new EmpresaModel(empresa);

                    let result = await comunicacao.gravarComunicacao();
                    if(result) {
                        res.status(201).json({msg: "Comunicação cadastrada com sucesso!", result});    
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

    async obterComunicacao(req, res) {
    try {
        let { id } = req.params;
        let comunicacao = new ComunicacaoModel();
        let comunicacaoEncontrada = await comunicacao.obter(id);
        if (comunicacaoEncontrada != null) {
            res.status(200).json(comunicacaoEncontrada);
        } else {
            res.status(404).json({ msg: "Registro não encontrado" });
        }
    } catch (error) {
        res.status(500).json({ msg: "Erro de servidor", detalhes: error.message });
    }
}

    async excluirComunicacao(req,res){
        try {
            let comunicacao = new ComunicacaoModel();
            let docsComunicacao = new DocsComunicacaoModel();
            let { id } = req.params;
            if(await comunicacao.obter(id) != null){
                if(await docsComunicacao.obter(id) != null){
                    let result = await docsComunicacao.deletarDocsComunicacao(id);
                    if(result){
                        let result = await comunicacao.deletarComunicacao(id);
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
                    let result = await comunicacao.deletarComunicacao(id);
                    if(result){
                        res.status(200).json({msg:"Documentos excluidos com sucesso"});
                    }
                    else{
                        res.status(400).json({msg:"Erro ao deletar este registro"})
                    }  
                }
            }
            else{
                res.status(404).json({msg:"Protocolo não encontrado"})
            }
        } catch (error) {
            res.status(500).json({msg:"Erro de servidor", detalhes: error.message})
        }
    }

    async alterarComunicacao(req, res) {
        try {
            if (req.body) {
                let { comId, comTitulo, comCanal, comData, comHora, comDescricao, usuario} = req.body;
    
                if (comId && comTitulo && comCanal && comData && comHora && comDescricao && usuario > 0) {
                    
                    let comunicacao = new ComunicacaoModel(comId, comTitulo, comCanal, comData, comHora, comDescricao, usuario);
                    
                    if (await comunicacao.obter(comId) != null) {
                                
                        let result = await comunicacao.gravarComunicacao();
                        if (result) {
                            res.status(200).json({ msg: "Comunicação atualizada com sucesso!" });
                        } else {
                            res.status(500).json({ msg: "Erro interno de servidor"});
                        }
                    
                    } else {
                        res.status(404).json({ msg: "Comunicação não encontrado para alteração" });
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