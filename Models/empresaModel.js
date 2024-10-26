import Database from "../db/database.js";

const banco = new Database();

export default class EmpresaModel{

    #empId
    #empCnpj
    #empNome
    #empRegime
    #empIe
    #empTelefone
    #empDescricao
    #empResponsavel
    #empProprietario
    #empInicio
    #empFim
    #empEmail
    #empEndereco
    #empBairro
    #empCidade
    #empCep
    #empUf

    get empId(){return this.#empId}
    set empId(empId){this.#empId = empId}

    get empCnpj(){return this.#empCnpj}
    set empCnpj(empCnpj){this.#empCnpj = empCnpj}

    get empNome(){return this.#empNome}
    set empNome(empNome){this.#empNome = empNome}

    get empRegime(){return this.#empRegime}
    set empRegime(empRegime){this.#empRegime = empRegime}

    get empIe(){return this.#empIe}
    set empIe(empIe){this.#empIe = empIe}

    get empTelefone(){return this.#empTelefone}
    set empTelefone(empTelefone){this.#empTelefone = empTelefone}

    get empDescricao(){return this.#empDescricao}
    set empDescricao(empDescricao){this.#empDescricao = empDescricao}

    get empResponsavel(){return this.#empResponsavel}
    set empResponsavel(empResponsavel){this.#empResponsavel = empResponsavel}

    get empProprietario(){return this.#empProprietario}
    set empProprietario(empProprietario){this.#empProprietario = empProprietario}

    get empInicio(){return this.#empInicio}
    set empInicio(empInicio){this.#empInicio = empInicio}

    get empFim(){return this.#empFim}
    set empFim(empFim){this.#empFim = empFim}

    get empEmail(){return this.#empEmail}
    set empEmail(empEmail){this.#empEmail = empEmail}

    get empEndereco(){return this.#empEndereco}
    set empEndereco(empEndereco){this.#empEndereco = empEndereco}

    get empBairro(){return this.#empBairro}
    set empBairro(empBairro){this.#empBairro = empBairro}

    get empCidade(){return this.#empCidade}
    set empCidade(empCidade){this.#empCidade = empCidade}

    get empCep(){return this.#empCep}
    set empCep(empCep){this.#empCep = empCep}

    get empUf(){return this.#empUf}
    set empUf(empUf){this.#empUf = empUf}

    constructor(empId, empCnpj, empNome, empRegime, empIe, empTelefone, empDescricao, empResponsavel, empProprietario, empInicio, empFim, empEmail,
    empEndereco, empBairro, empCidade, empCep, empUf){

        this.#empId = empId;
        this.#empCnpj = empCnpj;
        this.#empNome = empNome;
        this.#empRegime = empRegime;
        this.#empIe = empIe;
        this.#empTelefone = empTelefone;
        this.#empDescricao = empDescricao;
        this.#empResponsavel = empResponsavel;
        this.#empProprietario = empProprietario;
        this.#empInicio = empInicio;
        this.#empFim = empFim;
        this.#empEmail = empEmail;
        this.#empEndereco = empEndereco;
        this.#empBairro = empBairro;
        this.#empCidade = empCidade;
        this.#empCep = empCep;
        this.#empUf = empUf;
    }

    toJSON() {
        return {
            "empId": this.#empId,
            "empCnpj": this.#empCnpj,
            "empNome": this.#empNome,
            "empRegime": this.#empRegime,
            "empIe": this.#empIe,
            "empTelefone": this.#empTelefone,
            "empDescricao": this.#empDescricao,
            "empResponsavel": this.#empResponsavel,
            "empProprietario": this.#empProprietario,
            "empInicio": this.#empInicio,
            "empFim": this.#empFim,
            "empEmail": this.#empEmail,
            "empEndereco": this.#empEndereco,
            "empBairro": this.#empBairro,
            "empCidade": this.#empCidade,
            "empCep": this.#empCep,
            "empUf": this.#empUf
        }
    }

    async listar(){
        let lista = [];
        let sql = "select * from tb_empresa";

        let rows = await banco.ExecutaComando(sql)

        for(let i = 0; i< rows.length; i++ ){
            let row = rows[i]
            lista.push(new EmpresaModel(row["emp_id"], row["emp_cnpj"],row["emp_nome"], row["emp_regime"],row["emp_ie"], row["emp_telefone"], 
            row["emp_descricao"],row["emp_responsavel"], row["emp_proprietario"],row["emp_inicio"], row["emp_fim"],
            row["emp_email"], row["emp_endereco"], row["emp_bairro"], row["emp_cidade"], row["emp_cep"], row["emp_uf"]));
        }

        return lista
    }

    async gravarEmpresa(){
        let sql = "";
        let valores = "";

        if(this.#empId == 0){
            sql = `insert into tb_empresa (emp_cnpj, emp_nome, emp_regime, emp_ie, emp_telefone, emp_descricao, emp_responsavel, emp_proprietario, emp_inicio,
            emp_fim, emp_email, emp_endereco, emp_bairro, emp_cidade, emp_cep, emp_uf) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

            valores = [this.#empCnpj, this.#empNome, this.#empRegime, this.#empIe, this.#empTelefone, this.#empDescricao, this.#empResponsavel, 
            this.#empProprietario, this.#empInicio, this.#empFim, this.#empEmail, this.#empEndereco, this.#empBairro, this.#empCidade, this.#empCep, this.#empUf]
        }
        else{//alterar
            sql = `update tb_empresa set emp_cnpj = ?, emp_nome = ?, emp_regime = ?, emp_ie = ?, emp_telefone = ?, emp_descricao = ?,
            emp_responsavel = ?, emp_proprietario = ?, emp_inicio = ?, emp_fim = ?, emp_email = ?, emp_endereco = ?, emp_bairro = ?,
            emp_cidade = ?, emp_cep = ?, emp_uf = ?
            where emp_id = ?`;
            
            valores =  [this.#empCnpj, this.#empNome, this.#empRegime, this.#empIe, this.#empTelefone, this.#empDescricao, this.#empResponsavel, 
            this.#empProprietario, this.#empInicio, this.#empFim, this.#empEmail, this.#empEndereco, this.#empBairro, this.#empCidade, this.#empCep, this.#empUf, this.#empId]
        }

        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result;
    }

    async obter(id){
        let sql = "select * from tb_empresa where emp_id = ?";
        let valores = [id]

        let row = await banco.ExecutaComando(sql, valores)

        if(row.length > 0){
            return new EmpresaModel(row[0]["emp_id"], row[0]["emp_cnpj"],row[0]["emp_nome"], row[0]["emp_regime"],row[0]["emp_ie"], row[0]["emp_telefone"], row[0]["emp_descricao"], 
            row[0]["emp_responsavel"], row[0]["emp_proprietario"], row[0]["emp_inicio"], row[0]["emp_fim"], row[0]["emp_email"], row[0]["emp_endereco"], row[0]["emp_bairro"],
            row[0]["emp_cidade"], row[0]["emp_uf"]);
        }

        return null;
    }

    async deletarEmpresa(id){
        let sql = "delete from tb_empresa where emp_id = ?";

        let valores = [id];

        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result
    }

    async verificaCnpj(empCnpj, empId) {
        let sqlVerificaCnpj = "SELECT COUNT(*) AS total FROM tb_empresa WHERE emp_cnpj = ? AND emp_id != ?";
        let valoresVerifica = [empCnpj, empId];
        let resultVerifica = await banco.ExecutaComando(sqlVerificaCnpj, valoresVerifica);
    
        if (resultVerifica[0].total > 0) {
            return true;
        } else {
            return false;
        }
    }

}