import Database from "../db/database.js";

const banco = new Database()

export default class ControleDespesaModel{

    //empId, compMes e compAno vem da tabela competencia
    //protId vem da tabela protocolo
    //tipDespesa vem da tabela tipo despesa
    #empId
    #compMes
    #compAno 
    #conDescricao
    #conData
    #conValor
    #protId
    #tipDespId

    get empId(){return this.#empId}
    set empId(empId){this.#empId = empId}

    get compMes(){return this.#compMes}
    set compMes(compMes){this.#compMes = compMes}

    get compAno(){return this.#compAno}
    set compAno(compAno){this.#compAno = compAno}

    get conDescricao(){return this.#conDescricao}
    set conDescricao(conDescricao){this.#conDescricao = conDescricao}

    get conData(){return this.#conData}
    set conData(conData){this.#conData = conData}

    get conValor(){return this.#conValor}
    set conValor(conValor){this.#conValor = conValor}

    get protId(){return this.#protId}
    set protId(protId){this.#protId = protId}

    get tipDespId(){return this.#tipDespId}
    set tipDespId(tipDespId){this.#tipDespId = tipDespId}

    constructor(empId, compMes, compAno, conDescricao, conData, conValor, protId, tipDespId){
        this.#empId = empId
        this.#compMes = compMes
        this.#compAno = compAno
        this.#conDescricao = conDescricao
        this.#conData = conData
        this.#conValor = conValor
        this.#protId = protId
        this.#tipDespId = tipDespId
    }

    toJSON() {
        return {
            "empId": this.#empId,
            "compMes": this.#compMes,
            "compAno": this.#compAno,
            "conDescricao": this.#conDescricao,
            "conData": this.#conData,
            "conValor": this.#conValor,
            "protId": this.#protId,
            "tipDespId": this.#tipDespId
        }
    }

    async verificarTipDesp(id){

        let sql = 'select count(*) as count FROM tb_controledespesas where tb_TipoDespesa_tipDes_id = ?'
        let valores = [id]

        let result = await banco.ExecutaComando(sql,valores);

        if (result[0].count > 0) {
            return true;
        } else {
            return false;
        }
    }

    async gravar(despesas) {
        let sql = "";
        let resultado = [];
    
        // Percorre cada despesa no array
        for (let i = 0; i < despesas.length; i++) {
            let despesa = despesas[i];
    
            // Monta a SQL e os valores para a inserção de cada despesa
            sql = `INSERT INTO tb_controledespesas (
                tb_competencia_tb_empresa_emp_id, 
                tb_competencia_comp_mes, 
                tb_competencia_comp_ano, 
                con_descricao, 
                con_data, 
                con_valor, 
                tb_protocolo_prot_id, 
                tb_TipoDespesa_tipDes_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
            // Definindo os valores da despesa
            let valores = [
                despesa.empId,       // Empresa
                despesa.compMes,     // Mês
                despesa.compAno,     // Ano
                despesa.conDescricao, // Descrição
                despesa.conData,     // Data
                despesa.conValor,    // Valor
                despesa.protId,      // Protocolo
                despesa.tipDespId    // Tipo de despesa
            ];
    
            // Executa a query para cada despesa
            let result = await banco.ExecutaComandoNonQuery(sql, valores);
            resultado.push(result); // Adiciona o resultado da execução no array de resultados
        }
    
        // Retorna o array de resultados das inserções
        return resultado;
    }
}