'use client'
import { useEffect, useRef, useState } from "react"
import Link from "next/link";

export default function FormEmpresa(props) {

    let empresa = 
    props.empresa != null ? 
        props.empresa 
    : 
        {   empCnpj: "", empNome: "", empRegime: "", empIe: "", empTelefone: "", empDescricao: "",
            empResponsavel: "", empProprietario: "", empInicio: "", empFim: "", empEmail: "",
            empEndereco: "", empBairro: "", empCidade: "", empCep: "", empUf:""
        }

    let isAlteracao = empresa.empId != null;

    let cnpj = useRef("");
    let nome = useRef("");
    let regime = useRef("");
    let ie = useRef("");
    let telefone = useRef("");
    let descricao = useRef("");
    let responsavel = useRef("");
    let proprietario = useRef("");
    let inicio = useRef("");
    let fim = useRef("");
    let email = useRef("");
    let endereco = useRef("");
    let bairro = useRef("");
    let cidade = useRef("");
    let cep = useRef("");
    let uf = useRef("");

    function alterarEmpresa(id) {
        let ok = false;
        if( cnpj.current.value != "" &&
            nome.current.value != "" &&
            regime.current.value != "" &&
            ie.current.value != "" &&
            telefone.current.value != "" &&
            descricao.current.value != "" &&
            responsavel.current.value != "" &&
            proprietario.current.value != "" &&
            inicio.current.value != "" &&
            email.current.value != "" &&
            endereco.current.value != "" &&
            bairro.current.value != "" &&
            cidade.current.value != "" &&
            cep.current.value != "" &&
            uf.current.value != ""
        ) 
        {
            let empresa = {
                empId: id,
                empCnpj: cnpj.current.value,
                empNome: nome.current.value,
                empRegime: regime.current.value,
                empIe: ie.current.value,
                empTelefone: telefone.current.value,
                empDescricao: descricao.current.value,
                empResponsavel: responsavel.current.value,
                empProprietario: proprietario.current.value,
                empInicio: inicio.current.value,
                empFim: fim.current.value,
                empEmail: email.current.value,
                empEndereco: endereco.current.value,
                empBairro: bairro.current.value,
                empCidade: cidade.current.value, 
                empCep: cep.current.value,
                empUf: uf.current.value,
            }

            fetch('http://localhost:5000/empresa', {
                mode: 'cors',
                credentials: 'include',
                method: "PUT",
                headers:{
                    "Content-type": "application/json",
                },
                body: JSON.stringify(empresa)
            })
            .then(r => {
                ok = r.status == 200;
                return r.json();
            })
            .then(r=> {
                if(ok) {
                    alert(r.msg);

                    cnpj.current.value = "";
                    nome.current.value = "";
                    regime.current.value = "";
                    ie.current.value = "";
                    telefone.current.value = "";
                    descricao.current.value = "";
                    responsavel.current.value = "";
                    proprietario.current.value = "";
                    inicio.current.value = "";
                    fim.current.value = "";
                    email.current.value = "";
                    endereco.current.value = "";
                    bairro.current.value = "";
                    cidade.current.value = "";
                    cep.current.value = "";
                    uf.current.value = "";
                }
                else {
                    alert(r.msg);
                }
            })
        }
        else
        {
            alert("Preencha os campos corretamente!");
        }
    }

    function gravarEmpresa() {

        let ok = false;
        if(cnpj.current.value != "" &&
            nome.current.value != "" &&
            regime.current.value != "" &&
            ie.current.value != "" &&
            telefone.current.value != "" &&
            descricao.current.value != "" &&
            responsavel.current.value != "" &&
            proprietario.current.value != "" &&
            inicio.current.value != "" &&
            email.current.value != "" &&
            endereco.current.value != "" &&
            bairro.current.value != "" &&
            cidade.current.value != "" &&
            cep.current.value != "" &&
            uf.current.value != "") 
        {
            let empresa = {
                empCnpj: cnpj.current.value,
                empNome: nome.current.value,
                empRegime: regime.current.value,
                empIe: ie.current.value,
                empTelefone: telefone.current.value,
                empDescricao: descricao.current.value,
                empResponsavel: responsavel.current.value,
                empProprietario: proprietario.current.value,
                empInicio: inicio.current.value,
                empFim: fim.current.value,
                empEmail: email.current.value,
                empEndereco: endereco.current.value,
                empBairro: bairro.current.value,
                empCidade: cidade.current.value, 
                empCep: cep.current.value,
                empUf: uf.current.value,
            }

            fetch('http://localhost:5000/empresa', {
                mode: 'cors',
                credentials: 'include',
                method: "POST",
                headers:{
                    "Content-type": "application/json",
                },
                body: JSON.stringify(empresa)
            })
            .then(r => {
                ok = r.status == 200;
                return r.json();
            })
            .then(r=> {
                if(ok) {

                    cnpj.current.value = "";
                    nome.current.value = "";
                    regime.current.value = "";
                    ie.current.value = "";
                    telefone.current.value = "";
                    descricao.current.value = "";
                    responsavel.current.value = "";
                    proprietario.current.value = "";
                    inicio.current.value = "";
                    fim.current.value = "";
                    email.current.value = "";
                    endereco.current.value = "";
                    bairro.current.value = "";
                    cidade.current.value = "";
                    cep.current.value = "";
                    uf.current.value = "";
                    
                    router.push("/admin/empresas");
                    return alert(r.msg);
                    
                }
                else {
                    return alert(r.msg);
                }
            })
        }
        else
        {
            alert("Preencha os campos corretamente!");
        }
    }



    let [erroCNPJ, setErroCNPJ] = useState("");

    useEffect(() => {
        // Adiciona a máscara de CNPJ no campo
        const inputCnpj = cnpj.current;
        const applyCnpjMask = (e) => {
          var x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);
          e.target.value = !x[2]
            ? x[1]
            : x[1] + '.' + x[2] + '.' + x[3] + '/' + x[4] + (x[5] ? '-' + x[5] : '');
        };
    
        // Adiciona o listener de evento
        inputCnpj.addEventListener('input', applyCnpjMask);
    
        // Remove o listener ao desmontar o componente
        return () => {
          inputCnpj.removeEventListener('input', applyCnpjMask);
        };
      }, []);


    function validarCNPJ(cnpj){
 
        cnpj = cnpj.replace(/[^\d]+/g,'');
     
        if(cnpj == '') return false;
         
        if (cnpj.length != 14)
            return false;
     
        // Elimina CNPJs invalidos conhecidos
        if (cnpj == "00000000000000" || 
            cnpj == "11111111111111" || 
            cnpj == "22222222222222" || 
            cnpj == "33333333333333" || 
            cnpj == "44444444444444" || 
            cnpj == "55555555555555" || 
            cnpj == "66666666666666" || 
            cnpj == "77777777777777" || 
            cnpj == "88888888888888" || 
            cnpj == "99999999999999")
            return false;
             
        // Valida DVs
        let tamanho = cnpj.length - 2
        let numeros = cnpj.substring(0,tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
          soma += numeros.charAt(tamanho - i) * pos--;
          if (pos < 2)
                pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
            return false;
             
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0,tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
          soma += numeros.charAt(tamanho - i) * pos--;
          if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
              return false;
               
        return true;
        
    }

    const handleBlur = () => {
        const cnpjValue = cnpj.current.value;
        if (!validarCNPJ(cnpjValue)) {
          setErroCNPJ('CNPJ inválido');
        } else {
          setErroCNPJ('');
        }
      };

    return (

    <div className="container mt-1">
        <div className="card p-4 shadow">
            <h2 className="mb-4">{isAlteracao ? "Alterar Empresa" : "Cadastrar Empresa"}</h2>

            <div className="row">
                <div className="col-md-2 form-group mb-3">
                    <label htmlFor="cnpj">CNPJ</label>
                    <input onBlur={handleBlur} defaultValue={empresa.empCnpj} ref={cnpj} type="text" className="form-control" maxlength="18" placeholder="Digite o CNPJ"/>
                    {erroCNPJ && <small className="text-danger">{erroCNPJ}</small>}
                </div>
                <div className="col-md-6 form-group mb-3">
                    <label htmlFor="nome">Nome da Empresa</label>
                    <input defaultValue={empresa.empNome} ref={nome} type="text" className="form-control" placeholder="Digite o nome da empresa"/>
                </div>
            </div>
            

            <div className="form-group mb-3 col-md-7">
                <label htmlFor="telefone">Contato</label>
                <div className="row">
                    <div className="col-md-3 form-group mb-3">
                        <input defaultValue={empresa.empTelefone} ref={telefone} type="text" className="form-control" placeholder="Telefone"/>
                    </div>

                    <div className="col-md-7 form-group mb-3">
                        <input defaultValue={empresa.empEmail} ref={email} type="email" className="form-control" placeholder="E-mail"/>
                    </div>
                </div>
                
                
                
            </div>

            <div className="form-group mb-3">
                <label>Endereço Completo</label>
                <input defaultValue={empresa.empEndereco} ref={endereco} type="text" className="form-control" placeholder="Endereço"/>
                <div className="d-flex mt-2">
                    <input defaultValue={empresa.empBairro} ref={bairro} type="text" className="form-control me-2" placeholder="Bairro"/>
                    <input defaultValue={empresa.empCidade} ref={cidade} type="text" className="form-control me-2" placeholder="Cidade"/>
                    <input defaultValue={empresa.empUf} ref={uf} type="text" className="form-control me-2" placeholder="UF" maxlength="2"/>
                    <input defaultValue={empresa.empCep} ref={cep} type="text" className="form-control" placeholder="CEP" maxlength="8"/>
                </div>
            </div>

            <div className = "row">
                <div className="form-group mb-3 col-md-3">
                    <label>Regime</label>
                    <input defaultValue={empresa.empRegime} ref={regime} type="text" className="form-control" placeholder="Digite o regime da empresa"/>
                </div>

                <div className="form-group mb-3 col-md-3">
                    <label htmlFor="ie">Inscrição Estadual (IE)</label>
                    <input defaultValue={empresa.empIe} ref={ie} type="text" className="form-control" placeholder="Digite a IE da empresa"/>
                </div>
            </div>
            

            <div className="row">
                <div className="col-md-2 form-group mb-3">
                    <label htmlFor="inicio">Início</label>
                    <input defaultValue={empresa.empInicio} ref={inicio} type="date" className="form-control" id="inicio"/>
                </div>
                <div className="col-md-2 form-group mb-3">
                    <label htmlFor="fim">Fim</label>
                    <input defaultValue={empresa.empFim} ref={fim} type="date" className="form-control" id="fim"/>
                </div>
            </div>

            <div className = "row">
                <div className="col-md-3 form-group mb-3">
                    <label htmlFor="cnpj">Responsavel</label>
                    <input defaultValue={empresa.empCnpj} ref={responsavel} type="text" className="form-control" placeholder="Nome do responsavel"/>
                </div>

                <div className="col-md-3 form-group mb-3">
                    <label htmlFor="nome">Proprietário</label>
                    <input defaultValue={empresa.empNome} ref={proprietario} type="text" className="form-control" placeholder="Nome do proprietário"/>
                </div>
            </div>
            

            <div className="form-group mb-3">
                <label htmlFor="nome">Descricão</label>
                <input defaultValue={empresa.empNome} ref={descricao} type="textarea" className="form-control" maxlength="100"/>
            </div>

            <div className="d-flex justify-content-between mt-4">
                <button
                    onClick={() => isAlteracao ? alterarEmpresa(empresa.empId) : gravarEmpresa()}
                    className="btn btn-primary"
                >
                    {isAlteracao ? "Alterar" : "Cadastrar"}
                </button>
                <Link href="/admin/empresas" className="btn btn-outline-secondary">Voltar</Link>
            </div>

        </div>
    </div>
    )
}