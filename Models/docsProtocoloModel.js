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

    toJSON() {
        return {
            "protDocsId": this.#protDocsId,
            "protId": this.#protId,
            "protDocsNome": this.#protDocsNome
        }
    }

    async gravar() {
        if(this.#protDocsId == 0){
            let sql = "insert into tb_docsprotocolo (protDocs_id, tb_protocolo_prot_id, docs_nome) values (?, ?, ?)";

            let valores = [this.#protDocsId, this.#protId, this.#protDocsNome];

            return await banco.ExecutaComandoNonQuery(sql, valores);
        }
        // else{
        //     //alterar
        //     let sql = "update tb_produto set prd_cod = ?, prd_nome =?, prd_quantidade= ?, cat_id = ?, mar_id = ?, prd_imagem = ?, prd_preco = ? where prd_id = ?";

        //     let valores = [this.#produtoCodigo, this.#produtoNome, this.#produtoQuantidade, this.#categoriaId, this.#marcaId, this.#produtoImagem, this.#produtoPreco, this.#produtoId];

        //     return await conexao.ExecutaComandoNonQuery(sql, valores) > 0;
        // }
    }

    async obter(id){
        let sql = "select * from tb_docsprotocolo where tb_protocolo_prot_id = ?";
        let valores = [id]

        let rows = await banco.ExecutaComando(sql, valores)

        if(rows.length > 0){
            return rows.map(row => new DocsProtocoloModel(row["protDocs_id"],row["tb_protocolo_prot_id"],row["docs_nome"]))
        }

        return null;
    }

    async deletarDocsProtocolo(id){
        let sql = "delete from tb_docsprotocolo where tb_protocolo_prot_id = ?";

        let valores = [id];

        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result
    }

    async obterDocs(id) {
        let sql = `select * from tb_docsprotocolo where tb_protocolo_prot_id = ?`;
            
        let valores = [id];
    
        let rows = await banco.ExecutaComando(sql, valores);
    
        if(rows.length > 0){
            return new DocsProtocoloModel(rows[0]["protDocs_id"], rows[0]["tb_protocolo_prot_id"], rows[0]["docs_nome"])
        }

        return null;
    }
}
