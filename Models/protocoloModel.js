import Database from "../db/database.js";


const banco = new Database();

export default class ProtocoloModel{

    #protId
    #protTitulo
    #protTipo
    #protData
    #protDescricao
    #usuId
    #empId

    get protId(){return this.#protId}
    set protId(protId){this.#protId = protId}

    get protTitulo(){return this.#protTitulo}
    set protTitulo(protTitulo){this.#protTitulo = protTitulo}

    get protTipo(){return this.#protTipo}
    set protTipo(protTipo){this.#protTipo = protTipo}

    get protData(){return this.#protData}
    set protData(protData){this.#protData = protData}

    get protDescricao(){return this.#protDescricao}
    set protDescricao(protDescricao){this.#protDescricao = protDescricao}

    get usuId(){return this.#usuId}
    set usuId(usuId){this.#usuId = usuId}

    get empId(){return this.#empId}
    set empId(empId){this.#empId = empId}

    constructor(protId, protTitulo, protTipo, protData, protDescricao, usuId, empId){
        this.#protId = protId;
        this.#protTitulo = protTitulo;
        this.#protTipo = protTipo;
        this.#protData = protData;
        this.#protDescricao = protDescricao;
        this.#usuId = usuId;
        this.#empId = empId;
    }
  
}