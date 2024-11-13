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

    toJSON() {
        return {
            "tipDespId": this.#tipDespId,
            "tipDespDesc": this.#tipDespDescricao,
        }
    }

    async obter(id){
        let sql = "select * from tb_tipodespesa";
        let valores = [id]

        let row = await banco.ExecutaComando(sql, valores)

        if(row.length > 0){
            return new TipoDespesaModel(row[0]["tipDes_id"], row[0]["tipDes_descricao"])
        }

        return null;
    }

    async listar(){
        let lista = [];
        let sql = "select * from tb_tipodespesa";

        let rows = await banco.ExecutaComando(sql)

        for(let i = 0; i< rows.length; i++ ){
            let row = rows[i]
            lista.push(new TipoDespesaModel(row["tipDes_id"], row["tipDes_descricao"]));
        }

        return lista
    }

    async gravarTipoDespesa(){
        let sql = "";
        let valores = "";

        if(this.#tipDespId == 0){
            sql = "insert into tb_tipodespesa (tipDes_descricao) values (?)"

            valores = [this.#tipDespDescricao]
        }
        else{//alterar
            sql = "update tb_tipodespesa set tipDes_descricao = ? where tipDes_id = ?";
            
            valores =  [this.#tipDespDescricao, this.#tipDespId];
        }

        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result;
    }

    async deletar(id){
        let sql = "delete from tb_tipodespesa where tipDes_id = ?";

        let valores = [id];

        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result
    }
}