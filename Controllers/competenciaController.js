import CompetenciaModel from "../Models/competenciaModel.js"
import EmpresaModel from "../Models/empresaModel.js";


export default class CompetenciaController{


    async cadastrar(req,res){
        try {
            if(req.body){
               let { ano, empresa} = req.body
                if( ano != "" && empresa != ""){
                    let anoAtual = new Date().getFullYear();
                    if(ano < 2000 || ano > anoAtual){
                        res.status(400).json({msg: "Ano superior ao atual"});
                    }
                    else{
                        let competencia = new CompetenciaModel();
                        competencia.compAno = ano
                        competencia.compMes = Array.from({ length: 12 }, (_, i) => i + 1);
                        competencia.empresa = new EmpresaModel(empresa);

                        let verificaExiste = await competencia.verifica(ano, empresa);
                        if(verificaExiste == false){
                            let resultado = []

                            for(let mes of competencia.compMes){
                                competencia.compMes = mes;
                                let result = await competencia.gravar();
                                resultado.push(result)
                            }
                        
                            if(resultado) {
                                res.status(201).json({msg: "Competencia cadastrada com sucesso!", resultado});    
                            }
                            else{
                                res.status(500).json({msg: "Erro interno de servidor!"})
                            }
                        }
                        else{
                            res.status(201).json({msg: "já possui registro deste ano"});
                        }
                    }

                }
                else {
                    res.status(400).json({msg: "Por favor, preencha o ano"})
                }
            }
        } 
        catch (error) {
            res.status(400).json({msg: "Por favor, informe os dados do registro"})
        }

    }

}