import Autenticar from "../middlewares/autenticar.js";
import LoginModel from "../Models/loginModel.js";
import UsuarioModel from "../Models/usuarioModel.js";

export default class LoginController {

    async autenticar(req, res) {
        try{
            if(req.body) {
                let { usuEmail, usuSenha} = req.body;
                let loginModel = new LoginModel(usuEmail, usuSenha)
                if(await loginModel.autenticar()) {
                    
                    let usuario = new UsuarioModel();
                    usuario = await usuario.obterPorEmailSenha(usuEmail, usuSenha);
                    usuario.usuSenha = "";
                    let auth = new Autenticar();
                    let token = auth.gerarToken(usuario.toJSON())
                    
                    res.cookie("jwt", token, {
                        httpOnly: true
                    })

                    res.status(200).json({tokenAcesso: token, usuario: usuario});
                }
                else {
                    res.status(404).json({msg: "Usuário/senha inválidos"});
                }
            }
            else {
                res.status(400).json({msg: "Usuário e senha não informados"});
            } 
        }
        catch(ex) {
            res.status(500).json({msg: "Erro interno de servidor"});
        }
        
    }

    async logout(req,res){
        try {
            res.clearCookie("jwt", {
                httpOnly:true,
                secure:true,
                sameSite:'strict'
            })
            res.status(200).json({msg: "Logout realizado"})
        } catch (error) {
            res.status(500).json({msg: "Erro ao Deslogar"})
        }

    }
}