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
    #tipDespesa

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

    get tipDespesa(){return this.#tipDespesa}
    set tipDespesa(tipDespesa){this.#tipDespesa = tipDespesa}

    constructor(empId, compMes, compAno, conDescricao, conData, conValor, protId, tipDespesa){
        this.#empId = empId
        this.#compMes = compMes
        this.#compAno = compAno
        this.#conDescricao = conDescricao
        this.#conData = conData
        this.#conValor = conValor
        this.#protId = protId
        this.#tipDespesa = tipDespesa
    }
}