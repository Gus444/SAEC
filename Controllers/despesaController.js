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
}