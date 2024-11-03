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
        if (this.#protDocsId === 0) {
            let sql = "INSERT INTO tb_docsprotocolo (tb_protocolo_prot_id, docs_nome) VALUES (?, ?)";
            let valores = [this.#protId, this.#protDocsNome];

            // Executa o comando e retorna o resultado
            return await banco.ExecutaComandoNonQuery(sql, valores);
        } else {
            let sql = "UPDATE tb_docsprotocolo SET tb_protocolo_prot_id = ?, docs_nome = ? WHERE protDocs_id = ?";
            let valores = [this.#protId, this.#protDocsNome, this.#protDocsId];

            // Executa o comando e retorna o resultado
            return await banco.ExecutaComandoNonQuery(sql, valores) > 0; // Retorna verdadeiro se a atualização for bem-sucedida
        }
    }

    async obter(id) {
        let sql = "SELECT * FROM tb_docsprotocolo WHERE tb_protocolo_prot_id = ?";
        let valores = [id];

        let rows = await banco.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            return new DocsProtocoloModel(
                rows[0]["protDocs_id"],
                rows[0]["tb_protocolo_prot_id"],
                rows[0]["docs_nome"]
            );
        } else {
            return null;
        }
    }

    async deletarDocsProtocolo(id) {
        let sql = "DELETE FROM tb_docsprotocolo WHERE tb_protocolo_prot_id = ?";

        let valores = [id];

        let result = await banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    async obterDocs(id) {
        let sql = "SELECT * FROM tb_docsprotocolo WHERE tb_protocolo_prot_id = ?";
        let valores = [id];
        let lista = [];

        let rows = await banco.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];
                lista.push(new DocsProtocoloModel(
                    row["protDocs_id"],
                    row["tb_protocolo_prot_id"],
                    row["docs_nome"]
                ));
            }

            return lista;
        } else {
            return null;
        }
    }
}
