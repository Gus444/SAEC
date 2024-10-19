import Database from "../db/database.js";


const banco = new Database()

export default class TipoDespesaModel{

    #tipDespId
    #tipDespDescricao

    get tipDespId() {
        return this.#tipDespId;
    }
    set tipDespId(tipDespId) {
        this.#tipDespId = tipDespId;
    }
    get tipDespDescricao() {
        return this.#tipDespDescricao;
    }
    set tipDespDescricao(tipDespDescricao) {
        this.#tipDespDescricao = tipDespDescricao;
    }

    constructor(tipDespId, tipDespDescricao){
        this.#tipDespId = tipDespId;
        this.#tipDespDescricao = tipDespDescricao;
    }

    

}