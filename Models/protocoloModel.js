import Database from "../db/database.js";
import EmpresaModel from "./empresaModel.js";
import UsuarioModel from "./usuarioModel.js";


const banco = new Database();

export default class ProtocoloModel{

    #protId
    #protTitulo
    #protTipo
    #protData
    #protDescricao
    #usuario
    #empresa

    get protId(){return this.#protId}
    set protId(protId){this.#protId = protId}

    get protTitulo(){return this.#protTitulo}
    set protTitulo(protTitulo){this.#protTitulo = protTitulo}

    get protTipo(){return this.#protTipo}
    set protTipo(protTipo){this.#protTipo = protTipo}

    get protData(){return this.#protData}
    set protData(protData){this.#protData = protData}

    get protDescricao(){return this.#protDescricao}
    set protDescricao(protDescricao){this.#protDescricao = protDescricao}

    get usuario(){return this.#usuario}
    set usuario(usuario){this.#usuario = usuario}

    get empresa(){return this.#empresa}
    set empresa(empresa){this.#empresa = empresa}

    constructor(protId, protTitulo, protTipo, protData, protDescricao, usuario, empresa){
        this.#protId = protId;
        this.#protTitulo = protTitulo;
        this.#protTipo = protTipo;
        this.#protData = protData;
        this.#protDescricao = protDescricao;
        this.#usuario = usuario;
        this.#empresa = empresa;
    }
  
    toJSON() {
        return {
            "protId": this.#protId,
            "protTitulo": this.#protTitulo,
            "protTipo": this.#protTipo,
            "protData": this.#protData,
            "protDescricao": this.#protDescricao,
            "usuario": this.#usuario,
            "empresa": this.#empresa,
        }
    }

    async listar()  {
        let lista = [];
        let sql = `select * 
        from tb_protocolo u 
        inner join tb_usuario x on u.tb_usuario_usu_Id = x.usu_id
        inner join tb_empresa y on u.tb_empresa_emp_Id = y.emp_id`;

        let rows = await banco.ExecutaComando(sql);

        for(let i = 0; i < rows.length; i++) {
            let row = rows[i];

            lista.push(new ProtocoloModel(row["prot_id"], row["prot_Titulo"], row["prot_Tipo"], row["prot_Data"], row["prot_Descricao"], new UsuarioModel(row["usu_id"], row["usu_nome"]), new EmpresaModel(row["emp_id"],[],row["emp_nome"])));
        }

        return lista;
    }

    async listarPorEmpresa(id){

        let sql = `select * from tb_protocolo u
        inner join tb_usuario x on u.tb_usuario_usu_Id = x.usu_id
        inner join tb_empresa y on u.tb_empresa_emp_Id = y.emp_id
        where emp_id = ?`
        let valores = [id]

        let rows = await banco.ExecutaComando(sql, valores);

        return rows.map(row => new ProtocoloModel(
            row["prot_id"], row["prot_Titulo"], row["prot_Tipo"], row["prot_Data"], row["prot_Descricao"], new UsuarioModel(row["usu_id"], row["usu_nome"]), new EmpresaModel(row["emp_id"],[],row["emp_nome"])));
    }

    async gravarProtocolo(){
        let sql = "";
        let valores = "";

        if(this.#protId == 0){
            sql = "insert into tb_protocolo(prot_id, prot_Titulo, prot_Tipo, prot_Data, prot_Descricao, tb_usuario_usu_Id, tb_empresa_emp_Id) values (?,?,?,?,?,?,?)"

            valores = [this.#protId, this.#protTitulo, this.#protTipo, this.#protData, this.#protDescricao, this.#usuario.usuId, this.#empresa.empId];
        }
        else{//alterar
            sql = "update tb_protocolo set prot_Titulo = ?, prot_Tipo = ?, prot_Data = ?, prot_Descricao = ?, tb_usuario_usu_Id = ?, tb_empresa_emp_Id = ? where prot_id = ?";
            
            valores =  [this.#protTitulo, this.#protTipo, this.#protData, this.#protDescricao, this.#usuario.usuId, this.#empresa.empId, this.#protId];
        }

        let result = await banco.ExecutaComandoLastInserted(sql,valores);

        return result;
    }

    async obter(id) {
        let sql = `select * from tb_protocolo where prot_id = ?`;
            
        let valores = [id];
    
        let rows = await banco.ExecutaComando(sql, valores);
    
        // Verifica se há resultados
        if(rows.length > 0){
            return new ProtocoloModel(rows[0]["prot_id"], rows[0]["prot_Titulo"], rows[0]["prot_Tipo"],
            rows[0]["prot_Data"],rows[0]["prot_Descricao"],rows[0]["tb_usuario_usu_Id"],rows[0]["tb_empresa_emp_Id"])
        }
    
        return null;
    }

    async deletarProtocolo(id){
        let sql = "delete from tb_protocolo where prot_id = ?";

        let valores = [id];

        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result
    }

    async obterEmpresa(id){
        let sql = "select * from tb_protocolo where tb_empresa_emp_Id = ?"

        let valores = [id];
    
        let rows = await banco.ExecutaComando(sql, valores);
    
        // Verifica se há resultados
        if(rows.length > 0){
            return new ProtocoloModel(rows[0]["prot_id"], rows[0]["prot_Titulo"], rows[0]["prot_Tipo"],
            rows[0]["prot_Data"],rows[0]["prot_Descricao"],rows[0]["tb_usuario_usu_Id"],rows[0]["tb_empresa_emp_Id"])
        }
    
        return null;
    }
}