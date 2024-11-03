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
        if (this.#comDocsId === 0) {
            let sql = "INSERT INTO tb_docscomunicacao (tb_comunicacao_com_id, comDocs_nome) VALUES (?, ?)";
            let valores = [this.#comunicacaoId, this.#comDocsNome];
    
            // Executa o comando e retorna o resultado
            return await banco.ExecutaComandoNonQuery(sql, valores);
        } else {
            let sql = "UPDATE tb_docscomunicacao SET tb_comunicacao_com_id = ?, comDocs_nome = ? WHERE comDocs_id = ?";
            let valores = [this.#comunicacaoId, this.#comDocsNome, this.#comDocsId];
    
            // Executa o comando e retorna o resultado
            return await banco.ExecutaComandoNonQuery(sql, valores) > 0; // Retorna verdadeiro se a atualização for bem-sucedida
        }
    }

    async obter(id) {
        let sql = "select * from tb_docscomunicacao where tb_comunicacao_com_id = ?";
        let valores = [id];
    
        let rows = await banco.ExecutaComando(sql, valores);
    
        if (rows.length > 0) {
            return new DocsComunicacaoModel(
                rows[0]["comDocs_id"],
                rows[0]["tb_comunicacao_com_id"],
                rows[0]["comDocs_nome"]
            );
        } else {
            return null;
        }
    }

    async deletarDocsComunicacao(id){
        let sql = "delete from tb_docscomunicacao where tb_comunicacao_com_id = ?";

        let valores = [id];

        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result
    }

    async obterDocs(id) {
        let sql = "select * from tb_docscomunicacao where tb_comunicacao_com_id = ?";
        let valores = [id];
        let lista = []
    
        let rows = await banco.ExecutaComando(sql, valores);
    
        if (rows.length > 0) {
            for(let i = 0; i < rows.length; i++) {
                let row = rows[i]
                lista.push(new DocsComunicacaoModel(
                    row["comDocs_id"],
                    row["tb_comunicacao_com_id"],
                    row["comDocs_nome"]
                ));
            }

            return lista;
        } else {
            return null;
        }
    }
}