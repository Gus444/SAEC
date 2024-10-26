'use client'
import { useEffect, useRef, useState, useContext } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";
import EmpContext from "../context/empContext.js";
import UserContext from "../context/userContext.js";

export default function FormProtocolo(props){

    let router = useRouter();
    const { user, setUser } = useContext(UserContext); // usuário que vem do contexto que está logado
    const { emp, setEmp } = useContext(EmpContext); // empresa que vem do localStorage
    const [loading, setLoading] = useState(false);

    //impede de acessar caso não tenha uma empresa//
    useEffect(() => {
        // Verifica se a empresa está selecionada
        if (!emp) {
            // Redireciona para a página de empresas se nenhuma empresa estiver selecionada
            router.push("/admin/empresas");
        } else {
            setLoading(false);
        }
    }, [emp, router]);

    if (loading || !emp || !user) {
        return <div>Carregando...</div>;
    }
    ///////////////////////////////////////////////

    const usuario = user.usuId;
    const empresa = emp.empId;

    let protocolo = 
    props.protocolo != null ? 
        props.protocolo 
    : 
        {  
            protId: "", protTitulo: "", protTipo: "", protData: "", protDescricao: ""
        }

    let docsProtocolo = 
    props.docsProtocolo != null ? 
        props.docsProtocolo 
    : 
        {  
            protDocsId: "", protId: "", protDocsNome: ""
        }    

    let isAlteracao = protocolo.protId != null && protocolo.protId !== "";

    let titulo = useRef("");
    let tipo = useRef("");
    let data = useRef("");
    let descricao = useRef("");
    let img = useRef("")

    let msgRef = useRef(null);
    
    let [erroTitulo, setErroTitulo] = useState(false);
    let [erroTipo, setErroTipo] = useState(false);
    let [erroData, setErroData] = useState(false);
    let [erroDescricao, setErroDescricao] = useState(false);

    function gravarProtocolo() {
        let ok = true;
    
        if (titulo.current.value === "") {
            setErroTitulo(true);
            ok = false;
        } else {
            setErroTitulo(false);
        }
    
        if (tipo.current.value === "") {
            setErroTipo(true);
            ok = false;
        } else {
            setErroTipo(false);
        }
    
        if (data.current.value === "") {
            setErroData(true);
            ok = false;
        } else {
            setErroData(false);
        }
    
        if (descricao.current.value === "") {
            setErroDescricao(true);
            ok = false;
        } else {
            setErroDescricao(false);
        }
    
        msgRef.current.className = '';
        msgRef.current.innerHTML = '';
    
        if (ok) {
            let protocolo = {
                protTitulo: titulo.current.value,
                protTipo: tipo.current.value,
                protData: data.current.value,
                protDescricao: descricao.current.value,
                usuario: usuario,
                empresa: empresa
            };
    
            fetch('http://localhost:5000/protocolo', {
                mode: 'cors',
                credentials: 'include',
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(protocolo)
            })
            .then(response => {
                if (response.status === 201) {
                    return response.json(); // Processa a resposta como JSON
                } else {
                    throw new Error('Erro ao cadastrar protocolo');
                }
            })
            .then(data => {
                const protId = data.result;
                if (protId) {
                  
                    const formData = new FormData();
                    formData.append("protocolo", protId); 
                    formData.append("inputImage", img.current.files[0]); // Imagem selecionada
            
                    return fetch('http://localhost:5000/docsProtocolo', {
                        mode: 'cors',
                        credentials: 'include',
                        method: "POST",
                        body: formData
                    })
                } else {
                    throw new Error('ID do protocolo não encontrado');
                }
            })
            .then(res => {
                if (!res.ok) {
                    msgRef.current.className = "msgError";
                    msgRef.current.innerHTML = res.msg;
                }
                return res.json();
            })
            .then(response => {
                if (response) {
                    router.push("/admin/protocolo");
                } else {
                    msgRef.current.className = "msgError";
                    msgRef.current.innerHTML = response.msg;
                }
            })
            .catch(error => {
                console.error(error.message);
            });
        } else {
            msgRef.current.className = "msgError";
            msgRef.current.innerHTML = "Preencha todos os campos";
        }
    }
    
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
        if (data.current) {
            data.current.max = currentDate;

            const preventTyping = (e) => e.preventDefault();

            data.current.addEventListener('keydown', preventTyping);

            // Limpa os event listeners apenas se os elementos existirem
            return () => {
                if (data.current) {
                    data.current.removeEventListener('keydown', preventTyping);
                }
            };
        }
    }, []);
    

    return(
        <div className="container mt-1 d-flex justify-content-center">
            <div className="card mt-5 p-4 shadow" style={{ width: '800px' }}>
                <div ref={msgRef}>

                </div>
                <h2 className="mb-4">{isAlteracao ? "Alterar Protocolo" : "Cadastrar Protocolo"}</h2>

                <div className="row">
                    <div className="col-md-5 form-group mb-3">
                        <label htmlFor="nome">Titulo*</label>
                        <input defaultValue={protocolo.protTitulo} ref={titulo} type="text" className={`form-control ${erroTitulo ? 'is-invalid' : ''}`} onChange={() => setErroTitulo(false)} placeholder="Digite o Titulo"/>
                    </div>

                    <div className="col-md-5 form-group mb-3">
                        <label htmlFor="status">Tipo*</label>
                        <select defaultValue={protocolo.protTipo} ref={tipo} className={`form-control ${erroTipo ? 'is-invalid' : ''}`} onChange={() => setErroTipo(false)} placeholder="Tipo de documento">
                            <option value="">Selecione o tipo</option>
                            <option value="0">Entregue</option>
                            <option value="1">Recebido</option>
                        </select>
                    </div>
                </div>


                <div className="col-md-3 form-group mb-3">
                            <label htmlFor="data">Data*</label>
                            <input defaultValue={protocolo.protData} ref={data} type="date" className={`form-control ${erroData ? 'is-invalid' : ''}`} onChange={() => setErroData(false)} placeholder="Digite a Data"/>
                </div>
                        
                <div className="form-group mb-3">
                    <label htmlFor="descricao">Descricão</label>
                    <input defaultValue={protocolo.protDescricao} ref={descricao} type="textarea" className={`form-control ${erroDescricao ? 'is-invalid' : ''}`} onChange={() => setErroDescricao(false)} maxlength="100"/>
                    {erroDescricao && <small className="text-danger"> Ex: quem recebeu, quem entregou</small>}
                </div>

                <div className="col-md-7 form-group mb-3">
                    <label for="fileInput">Escolha um arquivo:</label>
                    <input type="file" defaultValue={docsProtocolo.protDocsNome} ref={img} id="fileInput" name="arquivo"/>
                </div>


            <div className="d-flex justify-content-between mt-4">
                 
                <button
                    onClick={() => isAlteracao ? alterarProtocolo(protocolo.protId) : gravarProtocolo()}
                    className="btn btn-primary"
                >
                    {isAlteracao ? "Alterar" : "Cadastrar"}
                </button>
                <Link href="/admin/protocolo" className="btn btn-outline-secondary">Voltar</Link>
                </div>

            </div>
        </div>
    );
}