import Database from "../db/database.js";

const banco = new Database

export default class DocsProtocoloModel{

    #protDocsId
    #protId
    #protDocsNome

    get protDocsId(){return this.#protDocsId}
    set protDocsId(protDocsId){this.#protDocsId = protDocsId}

    get protId(){return this.#protId}
    set protId(protId){this.#protId = protId}

    get protDocsNome(){return this.#protDocsNome}
    set protDocsNome(protDocsNome){this.#protDocsNome = protDocsNome}

    constructor(protDocsId, protId, protDocsNome){
        this.#protDocsId = protDocsId
        this.#protId = protId
        this.#protDocsNome = protDocsNome
    }
}
