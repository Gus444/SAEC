import Database from "../db/database.js";
import UsuarioModel from "../Models/usuarioModel.js"
import EmpresaModel from "./empresaModel.js";

const banco = new Database();

export default class ComunicacaoModel{

    #comId
    #comTitulo
    #comCanal
    #comData
    #comHora
    #comDescricao
    #usuario
    #empresa

    get comId(){return this.#comId}
    set comId(comId){this.#comId = comId}

    get comTitulo(){return this.#comTitulo}
    set comTitulo(comTitulo){this.#comTitulo = comTitulo}

    get comCanal(){return this.#comCanal}
    set comCanal(comCanal){this.#comCanal = comCanal}

    get comData(){return this.#comData}
    set comData(comData){this.#comData = comData}

    get comHora(){return this.#comHora}
    set comHora(comHora){this.#comHora = comHora}

    get comDescricao(){return this.#comDescricao}
    set comDescricao(comDescricao){this.#comDescricao = comDescricao}

    get usuario(){return this.#usuario}
    set usuario(usuario){this.#usuario = usuario}

    get empresa(){return this.#empresa}
    set empresa(empresa){this.#empresa = empresa}

    constructor(comId, comTitulo, comCanal, comData, comHora, comDescricao, usuario, empresa){
        this.#comId = comId;
        this.#comTitulo = comTitulo;
        this.#comCanal = comCanal;
        this.#comData = comData;
        this.#comHora = comHora;
        this.#comDescricao = comDescricao;
        this.#usuario = usuario;
        this.#empresa = empresa;
    }

    toJSON() {
        return {
            "comId": this.#comId,
            "comTitulo": this.#comTitulo,
            "comCanal": this.#comCanal,
            "comData": this.#comData,
            "comHora": this.#comHora,
            "comDescricao": this.#comDescricao,
            "usuario": this.#usuario.toJSON(),
            "empresa": this.#empresa.toJSON(),
        }
    }

    async listar()  {
        let lista = [];
        let sql = `select * 
        from tb_comunicacao u 
        inner join tb_usuario x on u.tb_usuario_usu_Id = x.usu_id
        inner join tb_empresa y on u.tb_empresa_emp_Id = y.emp_id`;

        let rows = await banco.ExecutaComando(sql);

        for(let i = 0; i < rows.length; i++) {
            let row = rows[i];

            lista.push(new ComunicacaoModel(row["com_id"], row["com_titulo"], row["com_canal"], row["com_data"], row["com_hora"], row["com_descricao"], new UsuarioModel(row["usu_id"], row["usu_nome"]), new EmpresaModel(row["emp_id"],[],row["emp_nome"])));
        }

        return lista;
    }

    async gravarComunicacao(){
        let sql = "";
        let valores = "";

        if(this.#comId == 0){
            sql = "insert into tb_comunicacao(com_id, com_titulo, com_canal, com_data, com_hora, com_descricao, tb_usuario_usu_Id, tb_empresa_emp_Id) values (?,?,?,?,?,?,?,?)"

            valores = [this.#comId, this.#comTitulo, this.#comCanal, this.#comData, this.#comHora, this.#comDescricao, this.#usuario.usuId, this.#empresa.empId];
        }
        else{//alterar
            sql = "update tb_comunicacao set com_titulo = ?, com_canal = ?, com_data = ?, com_hora = ?, com_descricao = ?, tb_usuario_usu_Id = ?, tb_empresa_emp_Id = ? where com_id = ?";
            
            valores =  [this.#comTitulo, this.#comCanal, this.#comData, this.#comHora, this.#comDescricao, this.#usuario.usuId, this.#empresa.empId, this.#comId];
        }

        let result = await banco.ExecutaComandoLastInserted(sql,valores);

        return result;
    }

    async obter(id) {
        // Consulta SQL para obter informações da comunicação e do documento
        let sql = `
            SELECT 
                u.com_id, 
                u.com_Titulo, 
                u.com_Canal, 
                u.com_Data, 
                u.com_Hora, 
                u.com_Descricao, 
                x.comDocs_id, 
                x.comDocs_nome 
            FROM tb_comunicacao u 
            INNER JOIN tb_docscomunicacao x ON x.tb_comunicacao_com_id = u.com_id 
            WHERE u.com_id = ?`;
            
        let valores = [id];
    
        let rows = await banco.ExecutaComando(sql, valores);
    
        // Verifica se há resultados
        if(rows.length > 0){
            return new ComunicacaoModel(rows[0]["com_id"], rows[0]["com_Titulo"],rows[0]["com_Canal"], rows[0]["com_Data"],rows[0]["com_Hora"], rows[0]["com_Descricao"], rows[0]["comDocs_id"], 
            rows[0]["comDocs_nome"], rows[0]["emp_proprietario"])
        }
    
        // Retorna null se não encontrar resultados
        return null;
    }

    async deletarComunicacao(id){
        let sql = "delete from tb_comunicacao where com_id = ?";

        let valores = [id];

        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result
    }

}