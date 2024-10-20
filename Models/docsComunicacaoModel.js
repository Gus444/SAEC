import Database from "../db/database.js";
const fs = require('fs');

const banco = Database()

export default class DocsComunicacao{

    #comDocsId
    #comId
    #comDocsNome

    get comDocsId(){return this.#comDocsId}
    set comDocsId(comDocsId){this.#comDocsId = comDocsId}

    get comId(){return this.#comId}
    set comId(comId){this.#comId = comId}

    get comDocsNome(){return this.#comDocsNome}
    set comDocsNome(comDocsNome){this.#comDocsNome = comDocsNome}

    constructor(comDocsId, comId, comDocsNome){
        this.#comDocsId = comDocsId
        this.#comId = comId
        this.#comDocsNome = comDocsNome
    }

}