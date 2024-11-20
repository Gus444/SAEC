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
    #conId //tive que colocar esse porque nao daria para alterar uma despesa especifica
    //o restante das exibicoes eu uso o id da empresa do mes e do ano para poder pegar as informacoes

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

    get tipDespId(){return this.#tipDespId}
    set tipDespId(tipDespId){this.#tipDespId = tipDespId}

    get conId(){return this.#conId}
    set conId(conId){this.#conId = conId}

    constructor(empId, compMes, compAno, conDescricao, conData, conValor, protId, tipDespId, conId){
        this.#empId = empId
        this.#compMes = compMes
        this.#compAno = compAno
        this.#conDescricao = conDescricao
        this.#conData = conData
        this.#conValor = conValor
        this.#protId = protId
        this.#tipDespId = tipDespId
        this.#conId = conId
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
            "tipDespId": this.#tipDespId,
            "conId": this.#conId
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

    async alterarDespesaEspecifica(){
        let sql = `update tb_controledespesas set tb_competencia_tb_empresa_emp_id = ?, tb_competencia_comp_mes = ?, tb_competencia_comp_ano =?,
        con_descricao = ?, con_data = ?, con_valor = ?, tb_protocolo_prot_id = ?, tb_TipoDespesa_tipDes_id = ? where con_id = ? 
        `
        let valores = [this.#empId, this.#compMes, this.#compAno, this.#conDescricao, this.#conData, this.#conValor, this.#protId, this.#tipDespId, this.#conId]

        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result;
    }

    async listarPorEmpresa(id){
        let sql = `SELECT 
                    tb_competencia_comp_ano AS ano, 
                    SUM(con_valor) AS total_despesa 
                FROM 
                    tb_controledespesas 
                WHERE 
                    tb_competencia_tb_empresa_emp_id = ?
                GROUP BY 
                    tb_competencia_comp_ano;`

        let valores = [id]

        let rows = await banco.ExecutaComando(sql, valores);

        return rows.map(row => ({
            ano: row.ano,
            totalDespesa: parseFloat(row.total_despesa) // Nome referente a coluna criada no sql
        }));
    }

    async obterAnoDelete(empresa,ano){//para exclusao
        let sql = `select * from tb_controledespesas where  tb_competencia_tb_empresa_emp_id = ? and tb_competencia_comp_ano = ?`;
        let valores = [empresa,ano];

        let rows = await banco.ExecutaComando(sql, valores);

        return rows.map(row => ({
            id: row.con_id,
            empresa: row.tb_competencia_tb_empresa_emp_id,
            mes: row.tb_competencia_comp_mes,
            ano: row.tb_competencia_comp_ano,
            descricao: row.con_descricao,
            data: row.con_data,
            valor: row.con_valor,
            protocolo: row.tb_protocolo_prot_id,
            tipo: row.tb_TipoDespesa_tipDes_id
        }));

    }

    async obterMesesAno(empresa,ano){//para exclusao
        let sql = `select * from tb_controledespesas where  tb_competencia_tb_empresa_emp_id = ? and tb_competencia_comp_ano = ?`;
        let valores = [empresa,ano];

        let rows = await banco.ExecutaComando(sql, valores);

        return rows.map(row => ({
            id: row.con_id,
            empresa: row.tb_competencia_tb_empresa_emp_id,
            mes: row.tb_competencia_comp_mes,
            ano: row.tb_competencia_comp_ano,
            descricao: row.con_descricao,
            data: row.con_data,
            valor: row.con_valor,
            protocolo: row.tb_protocolo_prot_id,
            tipo: row.tb_TipoDespesa_tipDes_id
        }));

    }

    async obterMeses(empresa, ano){//valor somado
        let sql = `SELECT 
                        tb_competencia_comp_mes AS mes,
                        SUM(con_valor) AS total_despesa 
                    FROM 
                        tb_controledespesas
                    WHERE 
                        tb_competencia_tb_empresa_emp_id = ? 
                        AND tb_competencia_comp_ano = ?
                    GROUP BY 
                        tb_competencia_comp_mes
                        `

        let valores = [empresa,ano]

        let rows = await banco.ExecutaComando(sql, valores);

        return rows.map(row => ({
            mes: row.mes,
            totalDespesa: parseFloat(row.total_despesa)
        }));
    }

    async obterDespesas(empresa, ano, mes){
        let sql = `SELECT 
                    cd.con_id AS id,
                    cd.con_descricao AS descricao,
                    cd.con_data AS data,
                    cd.con_valor AS valor,
                    cd.tb_protocolo_prot_id AS protocolo,
                    td.tipDes_id AS tipoDespesaId,    -- Inclui o ID do tipo de despesa
                    td.tipDes_descricao AS tipoDespesa -- Inclui o nome do tipo de despesa
                FROM 
                    tb_controledespesas cd
                INNER JOIN 
                    tb_tipodespesa td
                ON 
                    cd.tb_TipoDespesa_tipDes_id = td.tipDes_id
                WHERE 
                    cd.tb_competencia_tb_empresa_emp_id = ? 
                    AND cd.tb_competencia_comp_ano = ?
                    AND cd.tb_competencia_comp_mes = ?`

        let valores = [empresa,ano, mes]

        let rows = await banco.ExecutaComando(sql, valores);

        return rows.map(row => ({
            id: row.id,
            descricao: row.descricao,
            data: row.data,
            valor: row.valor,
            protocolo: row.protocolo,
            tipoDespesa: row.tipoDespesa
        }));
    }

    async deletarAno(empresa, ano){
        let sql = 'delete from tb_controledespesas where tb_competencia_tb_empresa_emp_id = ? and tb_competencia_comp_ano = ?'
        let valores = [empresa, ano]

        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result
    }

    async deletarMes(empresa, ano, mes){
        let sql = 'delete from tb_controledespesas where tb_competencia_tb_empresa_emp_id = ? and tb_competencia_comp_ano = ? and tb_competencia_comp_mes = ?'
        let valores = [empresa, ano, mes];

        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result
    }

    async deletarDespesa(id){
        let sql = 'delete from tb_controledespesas where con_id = ?'
        let valores = [id];

        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result
    }

    async obterDespesaEspecifica(id){
        let sql = "select * from tb_controledespesas where con_id = ?";
        let valores = [id]

        let row = await banco.ExecutaComando(sql, valores)

        if(row.length > 0){
            return new ControleDespesaModel(row[0]["tb_competencia_tb_empresa_emp_id"], row[0]["tb_competencia_comp_mes"],row[0]["tb_competencia_comp_ano"], row[0]["con_descricao"],row[0]["con_data"], row[0]["con_valor"], row[0]["tb_protocolo_prot_id"], row[0]["tb_TipoDespesa_tipDes_id"], row[0]["con_id"])
        }

        return null;
    }
}