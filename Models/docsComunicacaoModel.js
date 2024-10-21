import Database from "../db/database.js";

const banco =  new Database()

export default class DocsComunicacaoModel{

    #comDocsId
    #comunicacaoId
    #comDocsNome

    get comDocsId(){return this.#comDocsId}
    set comDocsId(comDocsId){this.#comDocsId = comDocsId}

    get comunicacaoId(){return this.#comunicacaoId}
    set comunicacaoId(comunicacaoId){this.#comunicacaoId = comunicacaoId}

    get comDocsNome(){return this.#comDocsNome}
    set comDocsNome(comDocsNome){this.#comDocsNome = comDocsNome}

    constructor(comDocsId, comunicacaoId, comDocsNome){
        this.#comDocsId = comDocsId
        this.#comunicacaoId = comunicacaoId
        this.#comDocsNome = comDocsNome
    }

    toJSON() {
        return {
            "comDocsId": this.#comDocsId,
            "comunicacaoId": this.#comunicacaoId,
            "comDocsNome": this.#comDocsNome
        }
    }

    async gravar() {
        if(this.#comDocsId == 0){
            let sql = "insert into tb_docscomunicacao (comDocs_id, tb_comunicacao_com_id, comDocs_nome) values (?, ?, ?)";

            let valores = [this.#comDocsId, this.#comunicacaoId, this.#comDocsNome];

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
        let sql = "select * from tb_docscomunicacao where tb_comunicacao_com_id = ?";
        let valores = [id]

        let rows = await banco.ExecutaComando(sql, valores)

        if(rows.length > 0){
            return rows.map(row => new DocsComunicacaoModel(row["comDocs_id"],row["tb_comunicacao_com_id"],row["comDocs_nome"]))
        }

        return null;
    }

    async deletarDocsComunicacao(id){
        let sql = "delete from tb_docscomunicacao where tb_comunicacao_com_id = ?";

        let valores = [id];

        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result
    }

    async obterDocs(id) {
        let sql = `select * from tb_docscomunicacao where tb_comunicacao_com_id = ?`;
            
        let valores = [id];
    
        let rows = await banco.ExecutaComando(sql, valores);
    
        if(rows.length > 0){
            return new DocsComunicacaoModel(rows[0]["comDocs_id"], rows[0]["tb_comunicacao_com_id"], rows[0]["comDocs_nome"])
        }

        return null;
    }
}