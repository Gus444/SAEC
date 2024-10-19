import Database from "../db/database";


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

    get protDescricao(){return this.#protId}
    set protId(protId){this.#protId = protId}

    get protId(){return this.#protId}
    set protId(protId){this.#protId = protId}

    get protId(){return this.#protId}
    set protId(protId){this.#protId = protId}

}