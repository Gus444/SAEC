import Database from "../db/database.js";
import EmpresaModel from "./empresaModel.js";

const banco = new Database();

export default class CompetenciaModel {
    // Atributos privados
    #compAno;
    #compMes;
    #empresa;

    // Getters e Setters
    get compAno() { return this.#compAno; }
    set compAno(compAno) { this.#compAno = compAno; }

    get compMes() { return this.#compMes; }
    set compMes(compMes) { this.#compMes = compMes; }

    get empresa() { return this.#empresa; }
    set empresa(empresa) { this.#empresa = empresa; }

    constructor(compAno, compMes, empresa) {
        this.#compAno = compAno;
        this.#compMes = compMes;
        this.#empresa = empresa;
    }

    toJSON() {
        return {
            compAno: this.#compAno,
            compMes: this.#compMes,
            empresa: this.#empresa,
        };
    }

    async gravar() {
        // O SQL deve incluir o comp_mes também
        let sql = 'INSERT INTO tb_competencia (comp_ano, comp_mes, tb_empresa_emp_id) VALUES (?, ?, ?)';
        let valores = [this.#compAno, this.#compMes, this.#empresa.empId]; // Corrigido para usar #empresa.empId

        try {
            const result = await banco.ExecutaComandoNonQuery(sql, valores);
            return result;
        } catch (error) {
            console.error("Erro ao gravar a competência:", error);
            throw error; // Lança o erro para ser tratado na controller
        }
    }

    async verifica(ano, empresa){
        let sql = 'select count(*) as count from tb_competencia where comp_ano = ? and tb_empresa_emp_id = ?'
        let valores = [ano, empresa]

        let result = await banco.ExecutaComando(sql,valores);

        if (result[0].count > 0) {
            return true;
        } else {
            return false;
        }
    }

    async verificaDespesa(ano, empresa, mes){
        let sql = 'select count(*) as count from tb_competencia where comp_ano = ? and tb_empresa_emp_id = ? and comp_mes = ?'
        let valores = [ano, empresa, mes]

        let result = await banco.ExecutaComando(sql,valores);

        if (result[0].count > 0) {
            return true;
        } else {
            return false;
        }
    }

}