import Database from "../db/database.js";

const banco = new Database()

export default class ParametrizacaoModel{

    #pId
    #pCnpj
    #pNome
    #pEndereco
    #pBairro
    #pCidade
    #pCep
    #pUf
    #pEmail
    #pTelefone
    #pCelular
    #pSite
    #pLogoTipoG
    #pLogoTipoP

    get pId(){return this.#pId}
    set pId(pId){this.#pId = pId}

    get pCnpj(){return this.#pCnpj}
    set pCnpj(pCnpj){this.#pCnpj = pCnpj}

    get pNome(){return this.#pNome}
    set pNome(pNome){this.#pNome = pNome}

    get pEndereco(){return this.#pEndereco}
    set pEndereco(pEndereco){this.#pEndereco = pEndereco}

    get pBairro(){return this.#pBairro}
    set pBairro(pBairro){this.#pBairro = pBairro}

    get pCidade(){return this.#pCidade}
    set pCidade(pCidade){this.#pCidade = pCidade}

    get pCep(){return this.#pCep}
    set pCep(pCep){this.#pCep = pCep}

    get pUf(){return this.#pUf}
    set pUf(pUf){this.#pUf = pUf}

    get pEmail(){return this.#pEmail}
    set pEmail(pEmail){this.#pEmail = pEmail}

    get pTelefone(){return this.#pTelefone}
    set pTelefone(pTelefone){this.#pTelefone = pTelefone}

    get pCelular(){return this.#pCelular}
    set pCelular(pCelular){this.#pCelular = pCelular}

    get pSite(){return this.#pSite}
    set pSite(pSite){this.#pSite = pSite}

    get pLogoTipoG(){return this.#pLogoTipoG}
    set pLogoTipoG(pLogoTipoG){this.#pLogoTipoG = pLogoTipoG}

    get pLogoTipoP(){return this.#pLogoTipoP}
    set pLogoTipoP(pLogoTipoP){this.#pLogoTipoP = pLogoTipoP}

    constructor(pId, pCnpj, pNome, pEndereco, pBairro, pCidade, pCep, pUf, pEmail, pTelefone, pCelular, pSite, pLogoTipoG, pLogoTipoP){
        this.#pId = pId
        this.#pCnpj = pCnpj
        this.#pNome = pNome
        this.#pEndereco = pEndereco
        this.#pBairro = pBairro
        this.#pCidade = pCidade
        this.#pCep = pCep
        this.#pUf = pUf
        this.#pEmail = pEmail
        this.#pTelefone = pTelefone
        this.#pCelular = pCelular
        this.#pSite = pSite
        this.#pLogoTipoG = pLogoTipoG
        this.#pLogoTipoP = pLogoTipoP
    }
}