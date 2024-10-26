import ComunicacaoModel from "../Models/comunicacaoModel.js";
import EmpresaModel from "../Models/empresaModel.js";
import ProtocoloModel from "../Models/protocoloModel.js";

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
                let protocolo = new ProtocoloModel()
                if(await protocolo.obterEmpresa(id) == null){
                    let comunicacao = new ComunicacaoModel()
                    if(await comunicacao.obterEmpresa(id) == null){
                        let result = await empresa.deletarEmpresa(id);
                        if(result){
                            res.status(200).json({msg:"Exclusão efetuada com sucesso"});
                        }
                        else{
                            res.status(500).json({msg:"Erro ao excluir empresa"});
                        }
                    }
                    else{
                        res.status(400).json({msg:"A empresa possui registro de comunicação"})
                    }
                }
                else{
                    res.status(400).json({msg: "A empresa possui registro de protocolo"})
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
                res.status(404).json({msg: "empresa não encontrado"});
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
                res.status(404).json({msg: "Empresa não encontrado"});
            }
        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

    async alterarEmpresa(req, res) {
        try {
            // Verificação básica do body da requisição
            if (!req.body) {
                return res.status(400).json({ msg: "Favor, informar os dados da empresa" });
            }
    
            // Desestruturação dos campos do body
            let {
                empId, empCnpj, empNome, empRegime, empIe, empTelefone, empDescricao,
                empResponsavel, empProprietario, empInicio, empFim, empEmail,
                empEndereco, empBairro, empCidade, empCep, empUf
            } = req.body;
    
            // Verificação de preenchimento de campos obrigatórios
            if (
                !empCnpj || !empNome || !empRegime || !empIe || !empTelefone ||
                !empResponsavel || !empProprietario || !empInicio || !empEmail ||
                !empEndereco || !empBairro || !empCidade || !empCep || !empUf
            ) {
                return res.status(400).json({ msg: "Favor, inserir todas as informações" });
            }
    
            // Criação do modelo de empresa
            let empresa = new EmpresaModel(
                empId, empCnpj, empNome, empRegime, empIe, empTelefone, empDescricao,
                empResponsavel, empProprietario, empInicio, empFim, empEmail,
                empEndereco, empBairro, empCidade, empCep, empUf
            );
    
            // Verificação de CNPJ duplicado em outro registro
            let cnpjDuplicado = await empresa.verificaCnpj(empCnpj, empId);
            if (cnpjDuplicado) {
                return res.status(400).json({ msg: "Este CNPJ já está cadastrado em outro registro" });
            }
    
            // Verificação se a empresa existe pelo ID
            const empresaExistente = await empresa.obter(empId);
            if (!empresaExistente) {
                return res.status(404).json({ msg: "Empresa não encontrada para atualização" });
            }
    
            // Gravação dos dados atualizados no banco
            const resultado = await empresa.gravarEmpresa();
            if (resultado) {
                return res.status(200).json({ msg: "Empresa atualizada com sucesso!" });
            } else {
                return res.status(500).json({ msg: "Erro ao atualizar a empresa" });
            }
        } catch (error) {
            // Captura e resposta para erros no servidor
            return res.status(500).json({ msg: "Erro de servidor", detalhes: error.message });
        }
    }
}