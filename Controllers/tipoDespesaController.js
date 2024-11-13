import ControleDespesaModel from "../Models/controleDespesaModel.js";
import TipoDespesaModel from "../Models/tipoDespesaModel.js";


export default class tipoDespesaController{


    async cadastrarTipoDespesa(req,res){
        try {
            if(req.body){
                let { tipDespDesc } = req.body;
                if(tipDespDesc != ""){
                    
                    let tipoDespesa = new TipoDespesaModel();
                    tipoDespesa.tipDespId = 0;
                    tipoDespesa.tipDespDescricao = tipDespDesc;

                    let result = await tipoDespesa.gravarTipoDespesa();
                
                    if(result){
                        res.status(201).json({msg: "Tipo de despesa cadastrado"});
                    }
                    else{
                        res.status(500).json({msg: "Erro ao gravar tipo de despesa"})
                    }
                
                }
                else{
                    res.status(400).json({msg: "Favor, inserir todas as informações"})
                }
            }
            else{
                res.status(400).json({msg: "Favor, informar os dados do tipo da despesa"})
            }
        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

    async listarTipoDespesa(req,res){
        try{
            let tipoDespesa = new TipoDespesaModel();
            let listaTipoDespesa = await tipoDespesa.listar()
            res.status(200).json(listaTipoDespesa);
        }
        catch(error){
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

    async obterTipoDespesa(req, res){
        try {
            let { id } = req.params;
            let tipoDespesa = new TipoDespesaModel()
            let tipoDespesaEncontrado = await tipoDespesa.obter(id);
            if(tipoDespesaEncontrado != null){
                res.status(200).json(tipoDespesaEncontrado);
            }
            else{
                res.status(404).json({msg: "não encontrado"});
            }
        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

    async excluirTipoDespesa(req,res){
        try {
            let tipoDespesa = new TipoDespesaModel();
            let { id } = req.params;
            if(await tipoDespesa.obter(id) != null){
                
                let despesa = new ControleDespesaModel()
                let verificarUso
                verificarUso = await despesa.verificarTipDesp(id)
                if(verificarUso == false){
                    let result = await tipoDespesa.deletar(id);
                    if(result){
                        res.status(200).json({msg:"Exclusão efetuada com sucesso"});
                    }
                    else{
                        res.status(500).json({msg:"Erro ao excluir usuario"});
                    }
                }
                else{
                    res.status(400).json({msg:"Não é possivel apagar, tipo de despesa em uso"})
                }
            }
            else{
                res.status(404).json({msg:"Usuario não encontrado"})
            }
        } catch (error) {
            res.status(500).json({msg:"Erro de servidor", detalhes: error.message})
        }
    }

}