'use client'
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FormUsuario(props){

    let router = useRouter();

    let usuario = 
    props.usuario != null ? 
        props.usuario 
    : 
        {  
            usuNome: "", usuEmail: "", usuSenha: "", usuTelefone: "", usuStatus: "", usuNivel: ""
        }

    let isAlteracao = usuario.usuId != null;

    let nome = useRef("");
    let email = useRef("");
    let senha = useRef("");
    let telefone = useRef("");
    let status = useRef("");
    let nivel = useRef("");

    let msgRef = useRef(null);

    let [erroNome, setErroNome] = useState(false);
    let [erroEmail, setErroEmail] = useState(false);
    let [erroSenha, setErroSenha] = useState(false);
    let [erroTelefone, setErroTelefone] = useState(false);
    let [erroStatus, setErroStatus] = useState(false);
    let [erroNivel, setErroNivel] = useState(false);

    function gravarUsuario() {

        let ok = true;

        if(nome.current.value == ""){
            setErroNome(true);
            ok = false
        } else{
            setErroNome(false)
        }

        if(email.current.value == ""){
            setErroEmail(true);
            ok = false
        } else{
            setErroEmail(false)
        }

        if(senha.current.value == ""){
            setErroSenha(true);
            ok = false
        } else{
            setErroSenha(false)
        }

        if(telefone.current.value == ""){
            setErroTelefone(true);
            ok = false
        } else{
            setErroTelefone(false)
        }

        if(status.current.value == ""){
            setErroStatus(true);
            ok = false
        } else{
            setErroStatus(false)
        }

        if(nivel.current.value == ""){
            setErroNivel(true);
            ok = false
        } else{
            setErroNivel(false)
        }

        msgRef.current.className = '';
        msgRef.current.innerHTML = '';

        if(ok){
            let usuario = {
                usuNome: nome.current.value,
                usuEmail: email.current.value,
                usuSenha: senha.current.value,
                usuTelefone: telefone.current.value,
                usuStatus: status.current.value,
                usuNivel: nivel.current.value,
            }

            fetch('http://localhost:5000/usuarios', {
                mode: 'cors',
                credentials: 'include',
                method: "POST",
                headers:{
                    "Content-type": "application/json",
                },
                body: JSON.stringify(usuario)
            })
            .then(r => {
                ok = r.status == 201;
                return r.json();
            })
            .then(r=> {
                if(ok) {
                    router.push("/admin/usuarios");
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

    //mascara do telefone
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

    
    return(
        <div className="container mt-1 d-flex justify-content-center">
            <div className="card mt-5 p-4 shadow" style={{ width: '800px' }}>
                <div ref={msgRef}>

                </div>
                <h2 className="mb-4">{isAlteracao ? "Alterar Usuario" : "Cadastrar Usuario"}</h2>

                <div className="row">
                    <div className="col-md-5 form-group mb-3">
                        <label htmlFor="nome">Nome*</label>
                        <input defaultValue={usuario.usuNome} ref={nome} type="text" className={`form-control ${erroNome ? 'is-invalid' : ''}`} onChange={() => setErroNome(false)} placeholder="Digite o nome"/>
                        {/* {erroCNPJ && <small className="text-danger">CNPJ é obrigatório</small>} */}
                    </div>

                    <div className="col-md-3 form-group mb-3">
                            <label htmlFor="telefone">Telefone*</label>
                            <input defaultValue={usuario.usuTelefone} ref={telefone} type="text" className={`form-control ${erroTelefone ? 'is-invalid' : ''}`} onChange={() => setErroTelefone(false)} maxLength="15" placeholder="Digite o telefone"/>
                            {/* {erroTelefone && <small className="text-danger">Telefone é obrigatório</small>} */}
                    </div>
                </div>


                <div className="col-md-7 form-group mb-3">
                            <label htmlFor="email">Email*</label>
                            <input defaultValue={usuario.usuEmail} ref={email} type="email" className={`form-control ${erroEmail ? 'is-invalid' : ''}`} onChange={() => setErroEmail(false)} placeholder="Digite o email"/>
                            {/* {erroEmail && <small className="text-danger">Email é obrigatório</small>} */}
                </div>

                <div className="col-md-5 form-group mb-3">
                        <label htmlFor="nivel">Nivel de permissão*</label>
                        <select defaultValue={usuario.usuNivel} ref={nivel} className={`form-control ${erroNivel ? 'is-invalid' : ''}`} onChange={() => setErroNivel(false)} placeholder="Nivel de acesso">
                            <option value="">Selecione o nivel</option>
                            <option value="0">Administrador</option>
                            <option value="1">Usuario</option>
                        </select>
                    </div>
                        
                    <div className="col-md-5 form-group mb-3">
                        <label htmlFor="status">Usuario ativo*</label>
                        <select defaultValue={usuario.usuStatus} ref={status} className={`form-control ${erroStatus ? 'is-invalid' : ''}`} onChange={() => setErroStatus(false)} placeholder="Usuario ativo">
                            <option value="">Selecione o status</option>
                            <option value="0">Ativo</option>
                            <option value="1">Inativo</option>
                        </select>
                    </div>

                <div className="row">
                    <div className="col-md-5 form-group mb-3">
                        <label htmlFor="senha">Senha*</label>
                        <input defaultValue={usuario.usuSenha} ref={senha} type="password" className={`form-control ${erroSenha ? 'is-invalid' : ''}`} onChange={() => setErroSenha(false)} placeholder="Digite a senha"/>
                        {/* {erroCNPJ && <small className="text-danger">CNPJ é obrigatório</small>} */}
                    </div>
                </div>  


                <div className="d-flex justify-content-between mt-4">
                <button
                    onClick={() => isAlteracao ? alterarUsuario(usuario.usuId) : gravarUsuario()}
                    className="btn btn-primary"
                >
                    {isAlteracao ? "Alterar" : "Cadastrar"}
                </button>
                <Link href="/admin/usuarios" className="btn btn-outline-secondary">Voltar</Link>
                </div>

            </div>
        </div>
    );
}