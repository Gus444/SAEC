import Database from "../db/database.js";

const banco = new Database()

export default class FaturamentoModel{

    //empId,compAno e compMes vem da tabela competencia
    #empId
    #compAno
    #compMes
    #fatValor
    #usuId

    get empId(){return this.#empId}
    set empId(empId){this.#empId = empId}

    get compAno(){return this.#compAno}
    set compAno(compAno){this.#compAno = compAno}

    get compMes(){return this.#compMes}
    set compMes(compMes){this.#compMes = compMes}

    get fatValor(){return this.#fatValor}
    set fatValor(fatValor){this.#fatValor = fatValor}

    get usuId(){return this.#usuId}
    set usuId(usuId){this.#usuId = usuId}

    constructor(empId, compAno, compMes, fatValor, usuId){
        this.#empId = empId
        this.#compAno = compAno
        this.#compMes = compMes
        this.#fatValor = fatValor
        this.#usuId = usuId
    }
    
}