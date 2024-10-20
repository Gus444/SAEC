import Database from "../db/database.js";

const banco = new Database()

export default class CompetenciaModel{

    #compAno
    #compMes
    #empId

    get compAno(){return this.#compAno}
    set compAno(compAno){this.#compAno = compAno}

    get compMes(){return this.#compMes}
    set compMes(compMes){this.#compMes = compMes}

    get empId(){return this.#empId}
    set empId(empId){this.#empId = empId}

    constructor(compAno, compMes, empId){
        this.#compAno = compAno;
        this.#compMes = compMes;
        this.#empId = empId;
    }
}