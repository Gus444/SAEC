import Database from "../db/database.js"
import UsuarioModel from "./usuarioModel.js";

const banco = new Database()

export default class LoginModel{

    #email;
    #senha;

    get email() {
        return this.#email;
    }
    set email(email) {
        this.#email = email;
    }
    get senha() {
        return this.#senha;
    }
    set senha(senha) {
        this.#senha = senha;
    }

    constructor(email, senha) {
        this.#email = email;
        this.#senha = senha;
    }

    async autenticar() {

        let sql = "select usu_id, usu_status from tb_usuario where usu_email = ? and usu_senha = ?";

        let valores = [this.#email, this.#senha];

        let rows = await banco.ExecutaComando(sql, valores);

        return rows.length > 0;
    }

    async verificaInativo(){

        let sql = "select usu_id, usu_status from tb_usuario where usu_email = ? and usu_senha = ?";

        let valores = [this.#email, this.#senha];

        let rows = await banco.ExecutaComando(sql, valores);

        if(rows.length > 0){
            return new UsuarioModel(rows[0]["usu_id"], rows[0]["usu_nome"],rows[0]["usu_email"], rows[0]["usu_senha"],rows[0]["usu_telefone"], rows[0]["usu_status"], rows[0]["usu_nivel"]);
        }

        return null
    }

    toJSON() {
        return {
            "usuEmail": this.#email,
            "usuSenha": this.#senha
        }
    }
}