import Database from "../db/database.js";

const banco = new Database();

export default class UsuarioModel{

    #usuId
    #usuNome
    #usuEmail
    #usuSenha
    #usuTelefone
    #usuStatus
    #usuNivel


    get usuId() {
        return this.#usuId;
    }
    set usuId(usuId) {
        this.#usuId = usuId;
    }

    get usuNome() {
        return this.#usuNome;
    }
    set usuNome(usuNome) {
        this.#usuNome = usuNome;
    }

    get usuEmail() {
        return this.#usuEmail;
    }
    set usuEmail(usuEmail) {
        this.#usuEmail = usuEmail;
    }

    get usuSenha() {
        return this.#usuSenha;
    }
    set usuSenha(usuSenha) {
        this.#usuSenha = usuSenha;
    }

    get usuTelefone() {
        return this.#usuTelefone;
    }
    set usuTelefone(usuTelefone) {
        this.#usuTelefone = usuTelefone;
    }

    get usuStatus() {
        return this.#usuStatus;
    }
    set usuStatus(usuStatus) {
        this.#usuStatus = usuStatus;
    }

    get usuNivel() {
        return this.#usuNivel;
    }
    set usuNivel(usuNivel) {
        this.#usuNivel = usuNivel;
    }

    constructor(usuId, usuNome, usuEmail, usuSenha, usuTelefone, usuStatus, usuNivel){
        this.#usuId = usuId;
        this.#usuNome = usuNome;
        this.#usuEmail = usuEmail;
        this.#usuSenha = usuSenha;
        this.#usuTelefone = usuTelefone;
        this.#usuStatus = usuStatus;
        this.#usuNivel = usuNivel;
    }

    toJSON() {
        return {
            "usuId": this.#usuId,
            "usuNome": this.#usuNome,
            "usuEmail": this.#usuEmail,
            "usuSenha": this.#usuSenha,
            "usuTelefone": this.#usuTelefone,
            "usuStatus": this.#usuStatus, //0 - ativo, 1 - inativo
            "usuNivel": this.#usuNivel //0 - administrador, 1 - funcionario 
        }
    }


    async listar(){
        let lista = [];
        let sql = "select * from tb_usuario";

        let rows = await banco.ExecutaComando(sql)

        for(let i = 0; i< rows.length; i++ ){
            let row = rows[i]
            lista.push(new UsuarioModel(row["usu_id"], row["usu_nome"],row["usu_email"], row["usu_senha"],row["usu_telefone"], row["usu_status"], row["usu_nivel"]));
        }

        return lista
    }

    async ContadorDeAdministrador(){
        let sql = "select count(*) as quantidade_admins from tb_usuario where usu_nivel = 0"

        let quantidade = await banco.ExecutaComando(sql)

        return quantidade[0].quantidade_admins;
    }

    async VerificarNivel(id){
        let sql = "select usu_nivel from tb_usuario where usu_id = ?"
        let valores = [id]

        let result = await banco.ExecutaComando(sql, valores);

        return result[0].usu_nivel;
    }

    async verificarEmail(usuEmail){
        let sql = "select count(*) as quantidade_emails from tb_usuario where usu_email = ?"
        let valores = [usuEmail]

        let quantidade = await banco.ExecutaComando(sql,valores)

        return quantidade[0].quantidade_emails
    }

    async verificarEmailAlteracao(usuEmail, usuId) {
        let sql = "SELECT COUNT(*) AS quantidade_emails FROM tb_usuario WHERE usu_email = ? AND usu_id != ?";
        let valores = [usuEmail, usuId];
        let quantidade = await banco.ExecutaComando(sql, valores);
    
        return quantidade[0].quantidade_emails;
    }

    async obter(id){
        let sql = "select * from tb_usuario where usu_id = ?";
        let valores = [id]

        let row = await banco.ExecutaComando(sql, valores)

        if(row.length > 0){
            return new UsuarioModel(row[0]["usu_id"], row[0]["usu_nome"],row[0]["usu_email"], row[0]["usu_senha"],row[0]["usu_telefone"], row[0]["usu_status"], row[0]["usu_nivel"])
        }

        return null;
    }

    async gravarUsuario(){
        let sql = "";
        let valores = "";

        if(this.#usuId == 0){
            sql = "insert into tb_usuario (usu_nome, usu_email, usu_senha, usu_telefone, usu_status, usu_nivel) values (?,?,?,?,?,?)"

            valores = [this.#usuNome, this.#usuEmail, this.#usuSenha, this.#usuTelefone, this.#usuStatus, this.#usuNivel]
        }
        else{//alterar
            sql = "update tb_usuario set usu_nome = ?, usu_email = ?, usu_senha = ?, usu_telefone = ?, usu_status = ?, usu_nivel = ? where usu_id = ?";
            
            valores =  [this.#usuNome, this.#usuEmail, this.#usuSenha, this.#usuTelefone, this.#usuStatus, this.#usuNivel, this.#usuId];
        }

        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result;
    }

    async deletarUsuario(id){
        let sql = "delete from tb_usuario where usu_id = ?";

        let valores = [id];

        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result
    }

    async obterPorEmailSenha(email, senha) {

        let sql = "select * from tb_usuario where usu_email = ? and usu_senha = ?";

        let valores = [email, senha];

        let row = await banco.ExecutaComando(sql, valores);

        if(row.length > 0) {
            return new UsuarioModel(row[0]["usu_id"], row[0]["usu_nome"],row[0]["usu_email"], row[0]["usu_senha"],row[0]["usu_telefone"], row[0]["usu_status"], row[0]["usu_nivel"])
        }

        return null;
    }

    async verificarNivel(usuId ,usuNivel){

        let sql = "select usu_nivel from tb_usuario where usu_id = ?"
        let result = await banco.ExecutaComando(sql, usuId)

        if(!result || result.length === 0){
            return false;
        }

        let nivelAtual = result[0].usu_nivel;

        if(nivelAtual == usuNivel){
            return true
        }
        else{
            return false
        }
    }

    async buscar(req) {
        let { query } = req.query;
        let sql = 'SELECT * FROM tb_usuario WHERE usu_nome LIKE ?';
        let valores = [`%${query}%`]; // Adicione '%' no início e no final para buscar por substrings
    
        let usuario = await banco.ExecutaComando(sql, valores);
        return usuario;
    }
}