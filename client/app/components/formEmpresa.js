'use client'
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FormEmpresa(props) {

    let router = useRouter();

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
    let inicio = useRef(null);
    let fim = useRef(null);
    let email = useRef("");
    let endereco = useRef("");
    let bairro = useRef("");
    let cidade = useRef("");
    let cep = useRef("");
    let uf = useRef("");

    let msgRef = useRef(null);

    let [erroCNPJ, setErroCNPJ] = useState("");
    let [erroNome, setErroNome] = useState(false);
    let [erroRegime, setErroRegime] = useState(false);
    let [erroIe, setErroIe] = useState(false);
    let [erroTelefone, setErroTelefone] = useState(false);
    let [erroResponsavel, setErroResponsavel] = useState(false);
    let [erroProprietario, setErroProprietario] = useState(false);
    let [erroInicio, setErroInicio] = useState(false);
    let [erroFim, setErroFim] = useState(false);
    let [erroEmail, setErroEmail] = useState(false);
    let [erroEndereco, setErroEndereco] = useState(false);
    let [erroBairro, setErroBairro] = useState(false);
    let [erroCidade, setErroCidade] = useState(false);
    let [erroCep, setErroCep] = useState(false);
    let [erroUf, setErroUf] = useState(false);
    

    function alterarEmpresa(id) {
        let ok = false;
        if( cnpj.current.value != "" &&
            nome.current.value != "" &&
            regime.current.value != "" &&
            ie.current.value != "" &&
            telefone.current.value != "" &&
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

        let ok = true;

        if(cnpj.current.value == ""){
            setErroCNPJ(true);
            ok = false
        } else{
            setErroCNPJ(false)
        }

        if(nome.current.value == ""){
            setErroNome(true);
            ok = false
        } else{
            setErroNome(false)
        }

        if(regime.current.value == ""){
            setErroRegime(true);
            ok = false
        } else{
            setErroRegime(false)
        }

        if(ie.current.value == ""){
            setErroIe(true);
            ok = false
        } else{
            setErroIe(false)
        }

        if(telefone.current.value == ""){
            setErroTelefone(true);
            ok = false
        } else{
            setErroTelefone(false)
        }

        if(responsavel.current.value == ""){
            setErroResponsavel(true);
            ok = false
        } else{
            setErroResponsavel(false)
        }

        if(proprietario.current.value == ""){
            setErroProprietario(true);
            ok = false
        } else{
            setErroProprietario(false)
        }

        if(inicio.current.value == ""){
            setErroInicio(true);
            ok = false
        } else{
            setErroInicio(false)
        }

        if(email.current.value == ""){
            setErroEmail(true);
            ok = false
        } else{
            setErroEmail(false)
        }

        if(endereco.current.value == ""){
            setErroEndereco(true);
            ok = false
        } else{
            setErroEndereco(false)
        }

        if(bairro.current.value == ""){
            setErroBairro(true);
            ok = false
        } else{
            setErroBairro(false)
        }

        if(cidade.current.value == ""){
            setErroCidade(true);
            ok = false
        } else{
            setErroCidade(false)
        }

        if(cep.current.value == ""){
            setErroCep(true);
            ok = false
        } else{
            setErroCep(false)
        }

        if(uf.current.value == ""){
            setErroUf(true);
            ok = false
        } else{
            setErroUf(false)
        }

        msgRef.current.className = '';
        msgRef.current.innerHTML = '';

        if(ok){
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
                ok = r.status == 201;
                return r.json();
            })
            .then(r=> {
                if(ok) {
                    router.push("/admin/empresas");
                }
                else {
                    msgRef.current.className = "msgError";
                    msgRef.current.innerHTML = r.msg;
                }
            })
        }
        else
        {
            msgRef.current.className = "msgError";
            msgRef.current.innerHTML = "Preencha todos os campos";
        }
    }

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

    useEffect(() => {
        const inputTelefone = telefone.current;
    
        const applyTelefoneMask = (e) => {
            let value = e.target.value.replace(/\D/g, "");
            value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
            value = value.replace(/(\d{5})(\d)/, "$1-$2");
            
            e.target.value = value;
            setErroTelefone(false);
        };
    
        const preventNonNumericInput = (e) => {
            // Previne a entrada de qualquer tecla que não seja numérica
            if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
                e.preventDefault();
            }
        };
    
        inputTelefone.addEventListener("input", applyTelefoneMask);
        inputTelefone.addEventListener("keydown", preventNonNumericInput);
    
        return () => {
            inputTelefone.removeEventListener("input", applyTelefoneMask);
            inputTelefone.removeEventListener("keydown", preventNonNumericInput);
        };
    }, []);

    function salvarTelefone(telefone) {
        if (typeof telefone !== 'string') {
            console.error('Erro: telefone deve ser uma string');
            return false;
        }
    
        telefone = telefone.replace(/[^\d]+/g,'');
        
        if(telefone === '') {
            return false;
        }
    
        return true;
    }

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

    //validacao das datas
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        const currentDate = getCurrentDate();
        
        // Verifica se os refs estão prontos antes de usar
        if (inicio.current && fim.current) {
            inicio.current.max = currentDate;
            fim.current.max = currentDate;

            const preventTyping = (e) => e.preventDefault();

            inicio.current.addEventListener('keydown', preventTyping);
            fim.current.addEventListener('keydown', preventTyping);

            // Limpa os event listeners apenas se os elementos existirem
            return () => {
                if (inicio.current) {
                    inicio.current.removeEventListener('keydown', preventTyping);
                }
                if (fim.current) {
                    fim.current.removeEventListener('keydown', preventTyping);
                }
            };
        }
    }, []);

    const handleFimChange = () => {
        const inicioDate = new Date(inicio.current.value);
        const fimDate = new Date(fim.current.value);

        if (fimDate < inicioDate) {
            setErroFim(true);
            fim.current.value = ''; // Reseta o valor de fim
        } else {
            setErroFim(false);
        }
    }

    return (

    <div className="container mt-1">
        <div className="card p-4 shadow">
        <div ref={msgRef}>

        </div>
            <h2 className="mb-4">{isAlteracao ? "Alterar Empresa" : "Cadastrar Empresa"}</h2>

            <div className="row">
                <div className="col-md-3 form-group mb-3">
                    <label htmlFor="cnpj">CNPJ*</label>
                    <input onBlur={handleBlur} defaultValue={empresa.empCnpj} ref={cnpj} type="text" className={`form-control ${erroCNPJ ? 'is-invalid' : ''}`} maxlength="18" placeholder="Digite o CNPJ"/>
                    {erroCNPJ && <small className="text-danger">{erroCNPJ}</small>}
                </div>
                <div className="col-md-6 form-group mb-3">
                    <label htmlFor="nome">Nome da Empresa*</label>
                    <input defaultValue={empresa.empNome} ref={nome} type="text" className={`form-control ${erroNome ? 'is-invalid' : ''}`} placeholder="Digite o nome da empresa" onChange={() => setErroNome(false)} />
                    {/* {erroNome && <small className="text-danger">Nome é obrigatório</small>} */}
                </div>
            </div>
            

            <div className="form-group mb-3 col-md-7">
                <label htmlFor="telefone">Contato*</label>
                <div className="row">
                    <div className="col-md-3 form-group mb-3">
                        <input onBlur={salvarTelefone} defaultValue={empresa.empTelefone} ref={telefone} type="text" className={`form-control ${erroTelefone ? 'is-invalid' : ''}`} onChange={() => setErroTelefone(false)} maxLength="15" placeholder="Telefone"/>
                        {/* {erroTelefone && <small className="text-danger">Telefone é obrigatório</small>} */}
                    </div>

                    <div className="col-md-7 form-group mb-3">
                        <input defaultValue={empresa.empEmail} ref={email} type="email" className={`form-control ${erroEmail ? 'is-invalid' : ''}`} onChange={() => setErroEmail(false)} placeholder="E-mail"/>
                        {/* {erroEmail && <small className="text-danger">Email é obrigatório</small>} */}
                    </div>
                </div>
                
                
                
            </div>

            <div className="form-group mb-3">
                <label>Endereço Completo*</label>
                <input defaultValue={empresa.empEndereco} ref={endereco} type="text" className={`form-control ${erroEndereco ? 'is-invalid' : ''}`} onChange={() => setErroEndereco(false)} placeholder="Endereço"/>
                {/* {erroEndereco && <small className="text-danger">Endereço é obrigatório</small>} */}

                <div className="d-flex mt-2">
                    <input defaultValue={empresa.empBairro} ref={bairro} type="text" className={`form-control ${erroBairro ? 'is-invalid' : ''}`} onChange={() => setErroBairro(false)} placeholder="Bairro"/>
                    {/* {erroBairro && <small className="text-danger">Bairro é obrigatório</small>} */}
                    <input defaultValue={empresa.empCidade} ref={cidade} type="text" className={`form-control ${erroCidade ? 'is-invalid' : ''}`} onChange={() => setErroCidade(false)} placeholder="Cidade"/>
                    {/* {erroCidade && <small className="text-danger">Cidade é obrigatório</small>} */}
                    <select defaultValue={empresa.empUf} ref={uf} className={`form-control ${erroUf ? 'is-invalid' : ''}`} onChange={() => setErroUf(false)} placeholder="UF">
                        <option value="">Selecione o estado</option>
                        <option value="AC">Acre (AC)</option>
                        <option value="AL">Alagoas (AL)</option>
                        <option value="AP">Amapá (AP)</option>
                        <option value="AM">Amazonas (AM)</option>
                        <option value="BA">Bahia (BA)</option>
                        <option value="CE">Ceará (CE)</option>
                        <option value="DF">Distrito Federal (DF)</option>
                        <option value="ES">Espírito Santo (ES)</option>
                        <option value="GO">Goiás (GO)</option>
                        <option value="MA">Maranhão (MA)</option>
                        <option value="MT">Mato Grosso (MT)</option>
                        <option value="MS">Mato Grosso do Sul (MS)</option>
                        <option value="MG">Minas Gerais (MG)</option>
                        <option value="PA">Pará (PA)</option>
                        <option value="PB">Paraíba (PB)</option>
                        <option value="PR">Paraná (PR)</option>
                        <option value="PE">Pernambuco (PE)</option>
                        <option value="PI">Piauí (PI)</option>
                        <option value="RJ">Rio de Janeiro (RJ)</option>
                        <option value="RN">Rio Grande do Norte (RN)</option>
                        <option value="RS">Rio Grande do Sul (RS)</option>
                        <option value="RO">Rondônia (RO)</option>
                        <option value="RR">Roraima (RR)</option>
                        <option value="SC">Santa Catarina (SC)</option>
                        <option value="SP">São Paulo (SP)</option>
                        <option value="SE">Sergipe (SE)</option>
                        <option value="TO">Tocantins (TO)</option>
                    </select>
                    {/* {erroUf && <small className="text-danger">Uf é obrigatório</small>} */}

                    <input defaultValue={empresa.empCep} ref={cep} type="text" className={`form-control ${erroCep ? 'is-invalid' : ''}`} onChange={() => setErroCep(false)} placeholder="CEP" maxlength="8"/>
                    {/* {erroCep && <small className="text-danger">CEP é obrigatório</small>} */}
                </div>
            </div>

            <div className = "row">
                <div className="form-group mb-3 col-md-3">
                    <label>Regime*</label>
                    <input defaultValue={empresa.empRegime} ref={regime} type="text" className={`form-control ${erroRegime ? 'is-invalid' : ''}`} onChange={() => setErroRegime(false)} placeholder="Digite o regime da empresa"/>
                    {/* {erroRegime && <small className="text-danger">Regime é obrigatório</small>} */}
                </div>

                <div className="form-group mb-3 col-md-3">
                    <label htmlFor="ie">Inscrição Estadual (IE)*</label>
                    <input defaultValue={empresa.empIe} ref={ie} type="text" className={`form-control ${erroIe ? 'is-invalid' : ''}`} onChange={() => setErroIe(false)} placeholder="Digite a IE da empresa"/>
                    {/* {erroIe && <small className="text-danger">Ie é obrigatório</small>} */}
                </div>
            </div>
            

            <div className="row">
                <div className="col-md-2 form-group mb-3">
                    <label htmlFor="inicio">Início*</label>
                    <input defaultValue={empresa.empInicio} ref={inicio} type="date" className={`form-control ${erroInicio ? 'is-invalid' : ''}`} onChange={() => setErroInicio(false)} id="inicio"/>
                    {/* {erroInicio && <small className="text-danger">inicio é obrigatório</small>} */}
                </div>
                <div className="col-md-2 form-group mb-3">
                    <label htmlFor="fim">Fim</label>
                    <input defaultValue={empresa.empFim} ref={fim} type="date" className="form-control" id="fim" onChange={handleFimChange}/>
                </div>
            </div>

            <div className = "row">
                <div className="col-md-3 form-group mb-3">
                    <label htmlFor="cnpj">Responsavel*</label>
                    <input defaultValue={empresa.empCnpj} ref={responsavel} type="text" className={`form-control ${erroResponsavel ? 'is-invalid' : ''}`} onChange={() => setErroResponsavel(false)} placeholder="Nome do responsavel"/>
                    {/* {erroResponsavel && <small className="text-danger">Responsavel é obrigatório</small>} */}
                </div>

                <div className="col-md-3 form-group mb-3">
                    <label htmlFor="nome">Proprietário*</label>
                    <input defaultValue={empresa.empNome} ref={proprietario} type="text" className={`form-control ${erroProprietario ? 'is-invalid' : ''}`} onChange={() => setErroProprietario(false)} placeholder="Nome do proprietário"/>
                    {/* {erroProprietario && <small className="text-danger">Proprietário é obrigatório</small>} */}
                </div>
            </div>
            

            <div className="form-group mb-3">
                <label htmlFor="nome">Descricão*</label>
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