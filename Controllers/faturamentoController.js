import CompetenciaModel from "../Models/competenciaModel.js";
import EmpresaModel from "../Models/empresaModel.js";
import FaturamentoModel from "../Models/faturamentoModel.js";


export default class FaturamentoController{

    async cadastrar(req, res) {
        try {
            if (req.body) {
                let { empresa, ano, meses, usuario} = req.body;
    
                // Validação
                if (!ano || !empresa || !meses || !usuario) {
                    return res.status(400).json({ msg: "Por favor, preencha todos os campos." });
                }
    
                // Verificar se a competência já existe
                let competencia = new CompetenciaModel();
                competencia.compAno = ano;
                competencia.empresa = new EmpresaModel(empresa);
                let competenciaExiste = await competencia.verifica(ano, empresa);
    
                if (!competenciaExiste) {
                    return res.status(400).json({ msg: "Competência não encontrada." });
                }

                let nomeMeses = ["janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
                // Gravar dados de faturamento
                for (let mes = 1; mes <= 12; mes++) {
                    let faturamento = new FaturamentoModel();
                    faturamento.empresa = empresa;
                    faturamento.compAno = ano;
                    faturamento.compMes = mes
                    faturamento.fatValor = meses[nomeMeses[mes - 1]];;
                    faturamento.usuario = usuario
                
                    let result = await faturamento.gravar();
                    if (!result) {
                        return res.status(500).json({ msg: "Erro ao gravar faturamento." });
                    }
                }
    
                res.status(201).json({ msg: "Faturamento cadastrado com sucesso!" });
            }
        } catch (error) {
            console.error("Erro ao cadastrar faturamento:", error);
            res.status(500).json({ msg: "Erro interno do servidor." });
        }
    }

    async listarFaturamentoPorEmpresa(req,res){
        try {
            let { id } = req.params;
            let faturamento = new FaturamentoModel();
            let listaFaturamento = await faturamento.listarPorEmpresa(id);
            
            res.status(200).json(listaFaturamento);

        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

    async obterFaturamento(req, res){
        try {
            let { ano, empresa } = req.params;
            let faturamento = new FaturamentoModel()
            let faturamentoEncontrado = await faturamento.obterFaturamento(empresa, ano);
            if(faturamentoEncontrado != null){
                res.status(200).json(faturamentoEncontrado);
            }
            else{
                res.status(404).json({msg: "Faturamento não encontrado"});
            }
        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

    async alterar(req, res) {
        try {
            if (req.body) {
                let { empresa, ano, meses, usuario } = req.body;
    
                // Validação
                if (!ano || !empresa || !meses || !usuario) {
                    return res.status(400).json({ msg: "Por favor, preencha todos os campos." });
                }
    
                // Verificar se a competência existe
                let competencia = new CompetenciaModel();
                let competenciaExiste = await competencia.verifica(ano, empresa); // Método para verificar por ID
    
                if (!competenciaExiste) {
                    return res.status(404).json({ msg: "Competência não encontrada." });
                }
    
                let nomeMeses = ["janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    
                // Atualizar dados de faturamento
                for (let mes = 1; mes <= 12; mes++) {
                    let faturamento = new FaturamentoModel();
                    faturamento.empresa = empresa;
                    faturamento.compAno = ano;
                    faturamento.compMes = mes;
                    faturamento.fatValor = meses[nomeMeses[mes - 1]];
                    faturamento.usuario = usuario;
    
                    let result = await faturamento.atualizar(empresa, ano, mes); // Método para atualizar
                    if (!result) {
                        return res.status(500).json({ msg: "Erro ao atualizar faturamento." });
                    }
                }
    
                res.status(200).json({ msg: "Faturamento atualizado com sucesso!" });
            }
        } catch (error) {
            console.error("Erro ao alterar faturamento:", error);
            res.status(500).json({ msg: "Erro interno do servidor." });
        }
    }

    async excluir(req, res) {
        try{
            let faturamento = new FaturamentoModel();
            let { ano, empresaId } = req.params;
            if(await faturamento.obterFaturamento(empresaId, ano) != null) {
                let result = await faturamento.deletar(empresaId, ano);
                if(result) {
                    res.status(200).json({msg: "Exclusão realizada com sucesso!"});
                }
                else {
                    res.status(500).json({msg: "Erro interno de servidor"});
                }
            }   
            else {
                res.status(404).json({msg: "Faturamento não encontrado para exclusão!"});
            }
        }
        catch(ex) {
                res.status(500).json(
                    {msg: "Erro inesperado! Entre em contato com o nosso suporte técnico.",
                    detalhes: ex.message})
            
        }

    }
}