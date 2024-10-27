import Database from "../db/database.js";

const banco = new Database();

export default class FaturamentoModel {
    // Atributos privados
    #empresa;
    #compAno;
    #compMes;
    #fatValor;
    #usuario;

    // Getters e setters
    get empresa() { return this.#empresa; }
    set empresa(empresa) { this.#empresa = empresa; }

    get compAno() { return this.#compAno; }
    set compAno(compAno) { this.#compAno = compAno; }

    get compMes() { return this.#compMes; }
    set compMes(compMes) { this.#compMes = compMes; }

    get fatValor() { return this.#fatValor; }
    set fatValor(fatValor) { this.#fatValor = fatValor; }

    get usuario() { return this.#usuario; }
    set usuario(usuario) { this.#usuario = usuario; }

    constructor(empresa, compAno, compMes, fatValor, usuario) {
        this.#empresa = empresa;
        this.#compAno = compAno;
        this.#compMes = compMes;
        this.#fatValor = fatValor;
        this.#usuario = usuario;
    }

    toJSON() {
        return {
            empresa: this.#empresa,
            compAno: this.#compAno,
            compMes: this.#compMes,
            fatValor: this.#fatValor,
            usuario: this.#usuario,
        };
    }

    async gravar() {
        // O SQL deve incluir o comp_mes também
        let sql = 'INSERT INTO tb_faturamento (tb_competencia_tb_empresa_emp_id, tb_competencia_comp_ano, tb_competencia_comp_mes, fat_valor, tb_usuario_usu_Id) VALUES (?, ?, ?, ?, ?)';
        let valores = [this.#empresa, this.#compAno, this.#compMes, this.#fatValor, this.#usuario];

        try {
            const result = await banco.ExecutaComandoNonQuery(sql, valores);
            return result;
        } catch (error) {
            console.error("Erro ao gravar a competência:", error);
            throw error; // Lança o erro para ser tratado na controller
        }
    }

    async verificaExiste(ano, mes, empresa) {
        const sql = 'SELECT COUNT(*) as count FROM tb_faturamento WHERE tb_competencia_comp_ano = ? AND tb_competencia_comp_mes = ? AND tb_competencia_tb_empresa_emp_id = ?';
        const valores = [ano, mes, empresa.empId]; // Ajuste conforme a estrutura do seu objeto

        try {
            const [result] = await banco.query(sql, valores); // Use o objeto 'banco' que você criou
            return result[0].count > 0; // Retorna true se existir, false caso contrário
        } catch (error) {
            console.error("Erro ao verificar a existência do faturamento:", error);
            throw error; // Lança o erro para ser tratado na controller
        }
    }

    async listarPorEmpresa(id){
        let sql = `SELECT 
                    tb_competencia_comp_ano AS ano, 
                    SUM(fat_valor) AS total_faturamento 
                FROM 
                    tb_faturamento 
                WHERE 
                    tb_competencia_tb_empresa_emp_id = ?
                GROUP BY 
                    tb_competencia_comp_ano;`

        let valores = [id]

        let rows = await banco.ExecutaComando(sql, valores);

        return rows.map(row => ({
            ano: row.ano,
            totalFaturamento: parseFloat(row.total_faturamento) // Converte o valor de 'total_faturamento' para número
        }));
    }

    async listarPorEmpresa(id){
        let sql = `SELECT 
                    tb_competencia_comp_ano AS ano, 
                    SUM(fat_valor) AS total_faturamento 
                FROM 
                    tb_faturamento 
                WHERE 
                    tb_competencia_tb_empresa_emp_id = ?
                GROUP BY 
                    tb_competencia_comp_ano;`

        let valores = [id]

        let rows = await banco.ExecutaComando(sql, valores);

        return rows.map(row => ({
            ano: row.ano,
            totalFaturamento: parseFloat(row.total_faturamento) // Converte o valor de 'total_faturamento' para número
        }));
    }

    async obterFaturamento(empresa, ano){
        let sql = `SELECT 
                        tb_competencia_tb_empresa_emp_id AS empresa,
                        tb_competencia_comp_ano AS ano,
                        tb_competencia_comp_mes AS mes,
                        fat_valor AS valor,
                        tb_usuario_usu_Id AS usuario
                    FROM 
                        tb_faturamento
                    WHERE 
                        tb_competencia_tb_empresa_emp_id = ? 
                        AND tb_competencia_comp_ano = ?`

        let valores = [empresa,ano]

        let rows = await banco.ExecutaComando(sql, valores);

        return rows.map(row => ({
            empresa: row.empresa,
            ano: row.ano,
            mes: row.mes,
            valor: row.valor,
            usuario: row.usuario
        }));
    }

    async atualizar(empresa, ano, mes){
        let sql = 'update tb_faturamento set fat_valor = ?, tb_usuario_usu_Id = ? where tb_competencia_tb_empresa_emp_id = ? and tb_competencia_comp_ano = ? and tb_competencia_comp_mes = ?'
        let valores = [this.#fatValor, this.#usuario, empresa, ano, mes]

        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result;
    }
}