import CompetenciaModel from "../Models/competenciaModel.js";
import ControleDespesaModel from "../Models/controleDespesaModel.js";
import EmpresaModel from "../Models/empresaModel.js";

export default class DespesaController{

    async cadastrar(req, res) {
        try {
            if (req.body) {
                let despesas = req.body; // Recebe o array de despesas do corpo da requisição
    
                // Verifica se o corpo contém um array
                if (!Array.isArray(despesas)) {
                    return res.status(400).json({ msg: "Esperado um array de despesas." });
                }
    
                let resultado = [];
                let anoAtual = new Date().getFullYear();
    
                // Percorre cada despesa no array
                for (let i = 0; i < despesas.length; i++) {
                    let { empresa, ano, mes, data, tipo, descricao, valor, protocolo } = despesas[i];

                    if(protocolo == "Sem Protocolo"){
                        protocolo = null
                    }
    
                    // Verifica se todos os campos necessários estão presentes
                    if (!ano || !mes || !tipo || !descricao || !valor || !data || !empresa) {
                        return res.status(400).json({ msg: `Despesas inválidas, faltando dados no índice ${i}.` });
                    }
    
                    // Verifica se o ano é válido (entre 2000 e o ano atual)
                    if (ano < 2000 || ano > anoAtual) {
                        return res.status(400).json({ msg: `Ano inválido, ano deve ser entre 2000 e o ano atual.` });
                    }

                    // Verifica se a competência já existe
                    let competencia = new CompetenciaModel();
                    competencia.compAno = ano;
                    competencia.compMes = mes; // Mês da despesa
                    competencia.empresa = new EmpresaModel(empresa);

                    let competenciaExiste = await competencia.verifica(ano, empresa);
                    if (!competenciaExiste) {
                        // Caso não exista, cria a competência para o mês da despesa
                        let resultadoCompetencia = await competencia.gravar();
                        if (!resultadoCompetencia) {
                            return res.status(500).json({ msg: `Erro ao cadastrar a competência para o ano ${ano} e mês ${mes}.` });
                        }
                    }
    
                    let despesa = new ControleDespesaModel();
                    despesa.empId = empresa;
                    despesa.compAno = ano;
                    despesa.compMes = mes;
                    despesa.conData = data;
                    despesa.tipDespId = tipo;
                    despesa.conDescricao = descricao;
                    despesa.conValor = valor;
                    despesa.protId = protocolo;
    
                    // Grava a despesa no banco de dados
                    let result = await despesa.gravar([despesa]); // Passa o array de despesas
                    resultado.push(result);  // Adiciona o resultado da gravação da despesa
                }
    
                // Se as despesas foram gravadas com sucesso
                if (resultado.length === despesas.length) {
                    res.status(201).json({ msg: "Despesas cadastradas com sucesso!", resultado });
                } else {
                    res.status(500).json({ msg: "Erro interno de servidor! Algumas despesas não foram gravadas." });
                }
            } else {
                res.status(400).json({ msg: "Por favor, informe os dados das despesas." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao cadastrar as despesas." });
        }
    }

    async listarDespesasEmp(req,res){
        try {
            let { id } = req.params;
            let despesa = new ControleDespesaModel();
            let listaDespesa = await despesa.listarPorEmpresa(id);
            
            res.status(200).json(listaDespesa);

        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

    async listarMeses(req, res){
        try {
            let { ano, empresa } = req.params;
            let mesesDespesa = new ControleDespesaModel()
            let mesesEncontrados = await mesesDespesa.obterMeses(empresa, ano);
            if(mesesEncontrados != null){
                res.status(200).json(mesesEncontrados);
            }
            else{
                res.status(404).json({msg: "Meses não encontrado"});
            }
        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

    async listarDespesasMes(req, res){
        try {
            let { ano, empresa, mes } = req.params;
            let despesas = new ControleDespesaModel()
            let despesasEncontradas = await despesas.obterDespesas(empresa, ano, mes);
            if(despesasEncontradas != null){
                res.status(200).json(despesasEncontradas);
            }
            else{
                res.status(404).json({msg: "Despesas não encontrado"});
            }
        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

    async excluirAno(req, res) {
        try{
            let despesa = new ControleDespesaModel();
            let { ano, empresa } = req.params;
            if(await despesa.obterAnoDelete(empresa, ano) != null) {
                let result = await despesa.deletarAno(empresa, ano);
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

    async listarDespesaEspecifica(req, res){
        try {
            let {id} = req.params;
            let despesas = new ControleDespesaModel()
            let despesasEncontradas = await despesas.obterDespesaEspecifica(id);
            if(despesasEncontradas != null){
                res.status(200).json(despesasEncontradas);
            }
            else{
                res.status(404).json({msg: "Despesas não encontrado"});
            }
        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

    async deletarMes(req,res){
        try{
            let despesa = new ControleDespesaModel();
            let { ano, empresa, mes } = req.params;
            if(await despesa.obterAnoDelete(empresa, ano, mes) != null) {
                let result = await despesa.deletarAno(empresa, ano);
                if(result) {
                    res.status(200).json({msg: "Exclusão realizada com sucesso!"});
                }
                else {
                    res.status(500).json({msg: "Erro interno de servidor"});
                }
            }   
            else {
                res.status(404).json({msg: "Despesa não encontrado para exclusão!"});
            }
        }
        catch(ex) {
                res.status(500).json(
                    {msg: "Erro inesperado! Entre em contato com o nosso suporte técnico.",
                    detalhes: ex.message})
            
        }
    }

    async deletarDespesaEspecifica(req,res){
        try {
            let despesa = new ControleDespesaModel();
            let { id } = req.params;
            if(await despesa.obterDespesaEspecifica(id) != null) {
                let result = await despesa.deletarDespesa(id);
                if(result) {
                    res.status(200).json({msg: "Exclusão realizada com sucesso!"});
                }
                else {
                    res.status(500).json({msg: "Erro interno de servidor"});
                }
            }
            else{
                res.status(404).json({msg: "Despesa não encontrado para exclusão!"});
            }
        }
        catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }


    async alterarDespesaEsp(req,res){
        try {
            if (req.body) {
                let { conId, compAno, compMes, conData, conDescricao, conValor, empId, protId, tipDespId } = req.body;
    
                if (conId && compAno && compMes && conData && conDescricao && conValor && empId > 0 && tipDespId > 0) {
                    
                    if(protId == '')
                        protId = null

                    let despesa = new ControleDespesaModel(empId, compMes, compAno, conDescricao, conData, conValor, protId, tipDespId, conId);
                    
                    if (await despesa.obterDespesaEspecifica(conId) != null) {
                    
                        let result = await despesa.alterarDespesaEspecifica();
                        if (result) {
                            res.status(200).json({ msg: "Despesa atualizado com sucesso!" });
                        } else {
                            res.status(500).json({ msg: "Erro interno de servidor" });
                        } 

                    } else {
                        res.status(404).json({ msg: "Despesa não encontrado para alteração" });
                    }
                } else {
                    res.status(400).json({ msg: "Existem campos que não foram preenchidos!" });
                }
            } else {
                res.status(400).json({ msg: "Preencha corretamente os dados do usuário!" });
            }

        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }
}