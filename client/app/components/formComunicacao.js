'use client'
import { useEffect, useRef, useState, useContext } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";
import EmpContext from "../context/empContext.js";
import UserContext from "../context/userContext.js";

export default function FormComunicacao(props){

    let comunicacao = 
    props.comunicacao != null ? 
        props.comunicacao 
    : 
        {  
            comId: "", comTitulo: "", comCanal: "", comData: "", comHora: "", comDescricao: ""
        }

    let docsComunicacao = 
    props.docsComunicacao != null ? 
        props.docsComunicacao 
    : 
        {  
            comDocsId: "", comId: "", comDocsNome: ""
        }    

    let isAlteracao = comunicacao.comId != null && comunicacao.comId !== "";

    let router = useRouter();
    const { user, setUser } = useContext(UserContext); // usuário que vem do contexto que está logado
    const { emp, setEmp } = useContext(EmpContext); // empresa que vem do localStorage
    const [loading, setLoading] = useState(false);
    const [arquivos, setArquivos] = useState([]);

    let [arquivoAlterado, setArquivoAlterado] = useState({
        docsEncontrados: [],
    });

    useEffect(() => {
        if (isAlteracao && JSON.stringify(arquivoAlterado) !== JSON.stringify(docsComunicacao)) {
            setArquivoAlterado(docsComunicacao);
        }
    }, [docsComunicacao, isAlteracao]);

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

    function handleFileChange(event) {
        const selectedFiles = Array.from(event.target.files);
        const nomesExistentes = arquivos.map(file => file.name);
    
        // Tipos de arquivos aceitos
        const tiposAceitos = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
    
        const novosArquivos = selectedFiles.filter(file => {
            // Verifica se o arquivo já foi selecionado
            if (nomesExistentes.includes(file.name)) {
                alert(`O arquivo "${file.name}" já foi selecionado.`);
                return false;
            }
    
            // Verifica se o tipo de arquivo é válido
            if (!tiposAceitos.includes(file.type)) {
                alert(`O arquivo "${file.name}" não é um tipo aceito. Apenas PNG, JPG, JPEG e PDF são permitidos.`);
                return false;
            }
    
            return true;
        });
    
        // Adiciona os novos arquivos ao estado
        setArquivos(prevArquivos => [...prevArquivos, ...novosArquivos]);
    }

    const removerArquivo = (index) => {
        setArquivos((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const usuario = user.usuId;
    const empresa = emp.empId;

    let titulo = useRef("");
    let canal = useRef("");
    let data = useRef("");
    let hora = useRef("");
    let descricao = useRef("");
    let img = useRef("")

    let msgRef = useRef(null);
    
    let [erroTitulo, setErroTitulo] = useState(false);
    let [erroCanal, setErroCanal] = useState(false);
    let [erroData, setErroData] = useState(false);
    let [erroHora, setErroHora] = useState(false);

    // Função para formatar a data no formato dd-mm-aaaa
    const formatarData = (data) => {
        const dataSelecionada = new Date(data);
        const dia = String(dataSelecionada.getDate()).padStart(2, "0");
        const mes = String(dataSelecionada.getMonth() + 1).padStart(2, "0");
        const ano = dataSelecionada.getFullYear();
        return `${dia}-${mes}-${ano}`;
      };

    // Handler para o evento de mudança da data
    const handleDateChange = (e) => {
        setErroData(false);
        const dataFormatada = formatarData(e.target.value);
        // Aqui você pode salvar `dataFormatada` conforme necessário
    };

    const removerArquivoAlterado = async (index) => {

        console.log(index)
        if(confirm("Tem certeza que deseja deletar este arquivo?")){

            let id = index;
    
            try {
                // Faz a requisição para deletar o arquivo no servidor
                let response = await fetch(`http://localhost:5000/docsComunicacao/${id}`, {
                    mode: 'cors',
                    credentials: 'include',
                    method: "DELETE",
                });
        
                if (!response.ok) {
                    throw new Error('Erro ao excluir arquivo');
                }
        
                // Após a exclusão bem-sucedida, atualiza o estado local
                setArquivoAlterado((prevState) => {
                    const updatedDocs = prevState.docsEncontrados.filter(doc => doc.comDocsId !== id);
                    console.log("Arquivos após a exclusão:", updatedDocs);  // Verificando os arquivos após remoção
                    return { ...prevState, docsEncontrados: updatedDocs };
                });
        
                console.log('Arquivo excluído com sucesso!');
            } catch (error) {
                console.error('Erro ao excluir o arquivo:', error);
            }
        }
        
    };

    function gravarComunicacao() {
        let ok = true;
    
        // Validação dos campos
        if (titulo.current.value === "") {
            setErroTitulo(true);
            ok = false;
        } else {
            setErroTitulo(false);
        }
    
        if (canal.current.value === "") {
            setErroCanal(true);
            ok = false;
        } else {
            setErroCanal(false);
        }
    
        if (data.current.value === "") {
            setErroData(true);
            ok = false;
        } else {
            setErroData(false);
        }
    
        if (hora.current.value === "") {
            setErroHora(true);
            ok = false;
        } else {
            setErroHora(false);
        }
    
        msgRef.current.className = '';
        msgRef.current.innerHTML = '';
    
        if (ok) {
            let comunicacao = {
                comTitulo: titulo.current.value,
                comCanal: canal.current.value,
                comData: data.current.value,
                comHora: hora.current.value,
                comDescricao: descricao.current.value,
                usuario: usuario,
                empresa: empresa
            };
    
            // Primeiro fetch para salvar os dados da comunicação
            fetch('http://localhost:5000/comunicacao', {
                mode: 'cors',
                credentials: 'include',
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(comunicacao)
            })
            .then(r => {
                if (r.status === 200) {
                    return r.json(); // Processa a resposta como JSON
                } else {
                    throw new Error('Erro ao cadastrar comunicação');
                }
            })
            .then(r => {
                const comId = r.result; // Pega o ID da comunicação criada
                if (comId) {
                    // Se a comunicação foi cadastrada com sucesso, fazer o segundo fetch para enviar as imagens
                    const formData = new FormData();
                    formData.append("comunicacao", comId); // Passa o ID da comunicação
    
                    // Adiciona todos os arquivos ao FormData
                    arquivos.forEach((arquivo) => {
                        formData.append("inputImage", arquivo); // Adiciona cada arquivo
                    });
    
                    return fetch('http://localhost:5000/docsComunicacao', {
                        mode: 'cors',
                        credentials: 'include',
                        method: "POST",
                        body: formData
                    });
                } else {
                    throw new Error('ID da comunicação não encontrado');
                }
            })
            .then(r => {
                if (!r.ok) {
                    msgRef.current.className = "msgError";
                    msgRef.current.innerHTML = res.msg;
                }
                return r.json();
            })
            .then(r => {
                if (r) {
                    router.push("/admin/comunicacao");
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

    function alterarComunicacao(id) {
        let ok = true;
    
        // Validação dos campos
        if (titulo.current.value === "") {
            setErroTitulo(true);
            ok = false;
        } else {
            setErroTitulo(false);
        }
    
        if (canal.current.value === "") {
            setErroCanal(true);
            ok = false;
        } else {
            setErroCanal(false);
        }
    
        if (data.current.value === "") {
            setErroData(true);
            ok = false;
        } else {
            setErroData(false);
        }
    
        if (hora.current.value === "") {
            setErroHora(true);
            ok = false;
        } else {
            setErroHora(false);
        }
    
        msgRef.current.className = '';
        msgRef.current.innerHTML = '';
    
        if (ok) {
            let comunicacao = {
                comId: id,
                comTitulo: titulo.current.value,
                comCanal: canal.current.value,
                comData: data.current.value,
                comHora: hora.current.value,
                comDescricao: descricao.current.value,
                usuario: usuario,
                empresa: empresa
            };
        
            fetch('http://localhost:5000/comunicacao', {
                mode: 'cors',
                credentials: 'include',
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(comunicacao)
            })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Erro ao cadastrar comunicacao');
                }
            })
            .then(r => {
                if (r.result) {
                    const comId = id;
                    if (comId) {
                        const formData = new FormData();
                        formData.append("comunicacao", comId);
                        arquivos.forEach((arquivo) => {
                            formData.append("inputImage", arquivo);
                        });
        
                        return fetch('http://localhost:5000/docsComunicacao', {
                            mode: 'cors',
                            credentials: 'include',
                            method: "PUT",
                            body: formData
                        });
                    } else {
                        throw new Error('ID da comunicacao não encontrado');
                    }
                }
            })
            .then(res => {
                if (!res || !res.ok) {
                    msgRef.current.className = "msgError";
                    msgRef.current.innerHTML = res?.msg || "Erro ao processar a requisição.";
                    throw new Error("Erro na resposta do servidor");
                }
                return res.json();
            })
            .then(response => {
                if (response) {
                    router.push("/admin/comunicacao");
                } else {
                    msgRef.current.className = "msgError";
                    msgRef.current.innerHTML = response.msg;
                }
            })
            .catch(error => {
                console.error("Erro ao alterar comunicação:", error.message);
                msgRef.current.className = "msgError";
                msgRef.current.innerHTML = "Ocorreu um erro ao salvar as alterações. Tente novamente.";
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

    console.log(docsComunicacao)
    console.log(comunicacao)

    return(
        <div className="container mt-1 d-flex justify-content-center">
            <div className="card mt-5 p-4 shadow" style={{ width: '800px' }}>
                <div ref={msgRef}>

                </div>
                <h2 className="mb-4">{isAlteracao ? "Alterar Comunicação" : "Cadastrar Comunicação"}</h2>
                <p className="text-muted mb-4">Campos com * são obrigatórios</p>

                <div className="row">
                    <div className="col-md-5 form-group mb-3">
                        <label htmlFor="nome">Titulo*</label>
                        <input defaultValue={comunicacao.comTitulo} ref={titulo} type="text" className={`form-control ${erroTitulo ? 'is-invalid' : ''}`} onChange={() => setErroTitulo(false)} placeholder="Digite o Titulo"/>
                    </div>

                    <div className="col-md-3 form-group mb-3">
                            <label htmlFor="canal">Canal*</label>
                            <select defaultValue={comunicacao.comCanal} ref={canal} type="text" className={`form-control ${erroCanal ? 'is-invalid' : ''}`} onChange={() => setErroCanal(false)} maxLength="15" placeholder="Digite o Canal">
                                <option value="">Selecione o Canal</option>
                                <option value="Whatsapp">Whatsapp</option>
                                <option value="Email">Email</option>
                                <option value="Telegram">Telegram</option>
                                <option value="Chat Online">Chat Online</option>
                                <option value="Redes Sociais">Redes Sociais</option>
                                <option value="Carta">Carta</option>
                                <option value="Fax">Fax</option>
                                <option value="Portal Web">Portal Web</option>
                                <option value="Outros">Outros</option>
                            </select>
                    </div>
                </div>


                <div className="col-md-3 form-group mb-3">
                            <label htmlFor="data">Data*</label>
                            <input defaultValue={comunicacao.comData ? comunicacao.comData.split('T')[0] : ''} ref={data} type="date" className={`form-control ${erroData ? 'is-invalid' : ''}`} onChange={handleDateChange} placeholder="Digite a Data"/>
                </div>

                <div className="col-md-2 form-group mb-3">
                        <label htmlFor="data">Hora*</label>
                        <input defaultValue={comunicacao.comHora} ref={hora} type="time" className={`form-control ${erroHora ? 'is-invalid' : ''}`} onChange={() => setErroHora(false)} placeholder="??"/>
                </div>
                        
                <div className="form-group mb-3">
                    <label htmlFor="nome">Descricão</label>
                    <input defaultValue={comunicacao.comDescricao} ref={descricao} type="textarea" className="form-control" maxlength="100"/>
                </div>

                <div className="col-md-7 form-group mb-3">
                <label htmlFor="fileInput">Escolha um arquivo:</label>
                <input 
                    type="file" 
                    ref={img} 
                    id="fileInput" 
                    onChange={handleFileChange} 
                    name="arquivo" 
                    multiple 
                />
            </div>

            {/* Exibe os arquivos selecionados com um botão para remover */}
            {/* Exibe os arquivos selecionados em um grid */}
            <div className="file-grid">
                {arquivos.length > 0 && (
                    <div className="row">
                        {arquivos.map((file, index) => (
                            <div key={index} className="file-item col-md-4">
                                <div className="file-preview d-flex align-items-center justify-content-between">
                                    <p className="m-0 text-truncate">{file.name}</p>
                                    <button 
                                        type="button" 
                                        onClick={() => removerArquivo(index)} 
                                        className="btn btn-link text-danger"
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div> 
                )}

                {arquivoAlterado.docsEncontrados && arquivoAlterado.docsEncontrados.length > 0 && (
                    <div className="row mt-3">
                        {arquivoAlterado.docsEncontrados.map((doc, index) => (
                        <div key={index} className="file-item col-md-4">
                            <div className="file-preview d-flex align-items-center justify-content-between">
                            <p className="m-0 text-truncate">{doc.comDocsNome}</p>
                            <button
                                type="button"
                                onClick={() => removerArquivoAlterado(doc.comDocsId)}
                                className="btn btn-link text-danger"
                            >
                                X
                            </button>
                            </div>
                        </div>
                        ))}
                    </div>
                )}
            </div>


            <div className="d-flex justify-content-between mt-4">
                 
                <button
                    onClick={() => isAlteracao ? alterarComunicacao(comunicacao.comId) : gravarComunicacao()}
                    className="btn btn-primary"
                >
                    {isAlteracao ? "Alterar" : "Cadastrar"}
                </button>
                <Link href="/admin/comunicacao" className="btn btn-outline-secondary">Voltar</Link>
                </div>

            </div>
        </div>
    );
}