import ComunicacaoModel from "../Models/comunicacaoModel.js";
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

    async cadastrarComunicacao(req, res) {
        try{
            if(req.body) {
                let { comTitulo, comCanal, comData, comHora, comDescricao, usuario, empresa} = req.body;
                if(comTitulo != "" && comCanal != "" && comData != "" && comHora != "" && usuario.usuId > 0, empresa.empId > 0){

                    let comunicacao = new ComunicacaoModel();
                    comunicacao.comId = 0;
                    comunicacao.comTitulo = comTitulo;
                    comunicacao.comCanal = comCanal;
                    comunicacao.comData = comData;
                    comunicacao.comHora = comHora;
                    comunicacao.comDescricao = comDescricao;
                    comunicacao.usuario = new UsuarioModel(usuario.usuId);
                    comunicacao.empresa = new EmpresaModel(empresa.empId)

                    let result = await comunicacao.gravarComunicacao();
                    if(result) {
                        res.status(201).json({msg: "Comunicação cadastrada com sucesso!"});    
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

}