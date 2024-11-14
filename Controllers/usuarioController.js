import ComunicacaoModel from "../Models/comunicacaoModel.js";
import ProtocoloModel from "../Models/protocoloModel.js";
import UsuarioModel from "../Models/usuarioModel.js";

export default class UsuarioController{

    async listarUsuario(req,res){
        try{
            let usuario = new UsuarioModel();
            let listaUsuarios = await usuario.listar()
            res.status(200).json(listaUsuarios);
        }
        catch(error){
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

    async obterUsuario(req, res){
        try {
            let { id } = req.params;
            let usuario = new UsuarioModel()
            let usuarioEncontrado = await usuario.obter(id);
            if(usuarioEncontrado != null){
                res.status(200).json(usuarioEncontrado);
            }
            else{
                res.status(404).json({msg: "Usuario não encontrado"});
            }
        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

    async cadastrarUsuario(req,res){
        try {
            if(req.body){
                let { usuNome, usuEmail, usuSenha, usuTelefone, usuStatus, usuNivel} = req.body;
                if(usuNome != "" && usuEmail != "" && usuSenha != "" && usuTelefone != "" && usuStatus >= 0 && usuNivel >= 0){
                    
                    let usuario = new UsuarioModel();
                    usuario.usuId = 0;
                    usuario.usuNome = usuNome;
                    usuario.usuEmail = usuEmail;
                    usuario.usuSenha = usuSenha;
                    usuario.usuTelefone = usuTelefone;
                    usuario.usuStatus = usuStatus;
                    usuario.usuNivel = usuNivel;

                    let verEmail = await usuario.verificarEmail(usuEmail)

                    if(verEmail == 0){

                        let result = await usuario.gravarUsuario();
                    
                        if(result){
                            res.status(201).json({msg: "Usuario cadastrado"});
                        }
                        else{
                            res.status(500).json({msg: "Erro ao gravar usuario"})
                        }
                    }
                    else{
                        res.status(400).json({msg: "Email já cadastrado no sistema, tente outro"})
                    }
                }
                else{
                    res.status(400).json({msg: "Favor, inserir todas as informações"})
                }
            }
            else{
                res.status(400).json({msg: "Favor, informar os dados do usuario"})
            }
        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }
    }

    async excluirUsuario(req,res){
        try {
            let usuario = new UsuarioModel();
            let { id } = req.params;
            if(await usuario.obter(id) != null){

                let verificaAdmin
                verificaAdmin = await usuario.VerificarNivel(id);

                if(verificaAdmin == 0){
                    let administradorCount;
                    administradorCount = await usuario.ContadorDeAdministrador();

                    if(administradorCount>1){

                        let protocolo = new ProtocoloModel()
                        if(await protocolo.obterUsuarioProtocolo(id) == null){

                            let comunicacao = new ComunicacaoModel()
                            if(await comunicacao.obterUsuarioComunicacao(id) == null){

                                let result = await usuario.deletarUsuario(id);

                                if(result){
                                    res.status(200).json({msg:"Exclusão efetuada com sucesso"});
                                }
                                else{
                                    res.status(500).json({msg:"Erro ao excluir usuario"});
                                }
                            }
                            else{
                                res.status(400).json({msg:"Não é possivel apagar o usuario pois o mesmo possui registro de comunicação"})
                            }
                        }
                        else{
                            res.status(400).json({msg:"Não é possivel apagar o usuario pois o mesmo possui registro de protocolo"})
                        }
                    }
                    else{
                        res.status(400).json({msg:"Não é possivel apagar, ultimo administrador do sistema"})
                    }
                }
                else{
                    let result = await usuario.deletarUsuario(id);
                    if(result){
                        res.status(200).json({msg:"Exclusão efetuada com sucesso"});
                    }
                    else{
                        res.status(500).json({msg:"Erro ao excluir usuario"});
                    }
                }
            }
            else{
                res.status(404).json({msg:"Usuario não encontrado"})
            }
        } catch (error) {
            res.status(500).json({msg:"Erro de servidor", detalhes: error.message})
        }
    }

    async alterarUsuario(req, res) {
        try {
            if (req.body) {
                let { usuId, usuNome, usuEmail, usuSenha, usuTelefone, usuStatus, usuNivel } = req.body;
    
                if (usuNome && usuEmail && usuSenha && usuTelefone && usuStatus >= 0 && usuNivel >= 0) {
                    
                    let usuario = new UsuarioModel(usuId, usuNome, usuEmail, usuSenha, usuTelefone, usuStatus, usuNivel);
                    
                    if (await usuario.obter(usuId) != null) {
                        
                        //let altNivel = await usuario.verificarNivel(usuId, usuNivel)

                            //if(altNivel != null && altNivel != false){
                                
                                let verEmail = await usuario.verificarEmailAlteracao(usuEmail, usuId);
                                if (verEmail == 0) {
                                    let result = await usuario.gravarUsuario();
                                    if (result) {
                                        res.status(200).json({ msg: "Usuário atualizado com sucesso!" });
                                    } else {
                                        res.status(500).json({ msg: "Erro interno de servidor" });
                                    }
                                } else {
                                    res.status(400).json({ msg: "Email já cadastrado no sistema, tente outro" });
                                }
                            //}
                            //else{
                                //res.status(403).json({msg: "Alteração de nível de usuário não permitida!"})
                            //}
                    } else {
                        res.status(404).json({ msg: "Usuário não encontrado para alteração" });
                    }
                } else {
                    res.status(400).json({ msg: "Existem campos que não foram preenchidos!" });
                }
            } else {
                res.status(400).json({ msg: "Preencha corretamente os dados do usuário!" });
            }
        } catch (ex) {
            res.status(500).json({
                msg: "Erro inesperado! Entre em contato com o nosso suporte técnico.",
                detalhes: ex.message
            });
        }
    }

    async buscar(req, res) {
        try {
         
            let { query } = req.query;
    
            if (!query || query.trim() === "") {
                return res.status(400).json({ msg: "Por favor, forneça um termo de busca." });
            }
            
            let usuario = new UsuarioModel();
            let result = await usuario.buscar(req); 
    
            if (result.length === 0) {
                return res.status(404).json({ msg: "Nenhum usuario foi encontrado." });
            }
    
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ msg: "Erro de servidor", detalhes: error.message });
        }
    }
}