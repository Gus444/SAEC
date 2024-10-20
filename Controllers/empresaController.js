import EmpresaModel from "../Models/empresaModel.js";

export default class EmpresaController{

    async listarEmpresas(req,res){
        try {
            let empresa = new EmpresaModel();
            let listaEmpresas = await empresa.listar()
            res.status(200).json(listaEmpresas)
        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

    async cadastrarEmpresa(req,res){
        try {
            if(req.body){
                let { empCnpj ,empNome, empRegime, empIe, empTelefone, empDescricao, empResponsavel, empProprietario, empInicio,
                    empFim, empEmail, empEndereco, empBairro, empCidade, empCep, empUf} = req.body;
                if(empCnpj != "" && empNome != "" && empRegime != "" && empIe != "" && empTelefone != "" &&
                    empResponsavel != "" && empProprietario != "" && empInicio != "" && empEmail != "" &&
                    empEndereco != "" && empBairro != "" && empCidade != "" && empCep != "" && empUf != "" 
                ){
                    let empresa = new EmpresaModel();
                    let cnpjDuplicado = await empresa.verificaCnpj(empCnpj, 0);
                    
                    if(!cnpjDuplicado){
                        
                        let result
                        empresa.empId = 0;
                        empresa.empCnpj = empCnpj;
                        empresa.empNome = empNome;
                        empresa.empRegime = empRegime;
                        empresa.empIe = empIe;
                        empresa.empTelefone = empTelefone;
                        empresa.empDescricao = empDescricao;
                        empresa.empResponsavel = empResponsavel;
                        empresa.empProprietario = empProprietario;
                        empresa.empInicio = empInicio;
                        empresa.empFim = empFim;
                        empresa.empEmail = empEmail;
                        empresa.empEndereco = empEndereco;
                        empresa.empBairro = empBairro;
                        empresa.empCidade = empCidade;
                        empresa.empCep = empCep;
                        empresa.empUf = empUf;

                        result = await empresa.gravarEmpresa();

                        if(result){
                            res.status(201).json({msg: "Empresa cadastrada"});
                        }
                        else{
                            res.status(500).json({msg: "Erro ao gravar empresa"})
                        }
                    }
                    else{
                        res.status(400).json({msg: "Este CNPJ já esta cadastrado"})
                    }
                }
                else{
                    res.status(400).json({msg: "Favor, inserir todas as informações"})
                }
            }
            else{
                res.status(400).json({msg: "Favor, informar os dados da empresa"})
            }
        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

    async excluirEmpresa(req,res){
        try {
            let empresa = new EmpresaModel();
            let { id } = req.params;
            if(await empresa.obter(id) != null){
                let result = await empresa.deletarEmpresa(id);
                if(result){
                    res.status(200).json({msg:"Exclusão efetuada com sucesso"});
                }
                else{
                    res.status(500).json({msg:"Erro ao excluir empresa"});
                }
            }
            else{
                res.status(404).json({msg:"Empresa não encontrado"})
            }
        } catch (error) {
            res.status(500).json({msg:"Erro de servidor", detalhes: error.message})
        }
    }

    async obterEmpresaAcesso(req, res){ //para acessar no frontend
        try {
            let { id } = req.params;
            let empresa = new EmpresaModel()
            let empresaEncontrada = await empresa.obter(id);
            if(empresa != null){
                res.status(200).json({empresaEncontrada: empresaEncontrada});
            }
            else{
                res.status(404).json({msg: "Usuario não encontrado"});
            }
        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

    async obterEmpresa(req, res){
        try {
            let { id } = req.params;
            let empresa = new EmpresaModel()
            let empresaEncontrada = await empresa.obter(id);
            if(empresa != null){
                res.status(200).json(empresaEncontrada);
            }
            else{
                res.status(404).json({msg: "Usuario não encontrado"});
            }
        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

}