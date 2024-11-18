'use client'
import { useEffect, useRef, useState, useContext } from "react"
import { useRouter } from "next/navigation";
import EmpContext from "../context/empContext.js";
import Link from "next/link";
import CadastroTipoDespesa from "./cadastroTD.js";

export default function FormAlterarDespesa(props){

    let msgRef = useRef(null);
    let router = useRouter();

    //set de erros
    let [erroAno, setErroAno] = useState(false);
    let [erroMes, setErroMes] = useState(false);
    let [erroData, setErroData] = useState(false);
    let [erroTipo, setErroTipo] = useState(false);
    let [erroDescricao, setErroDescricao] = useState(false);
    let [erroValor, setErroValor] = useState(false);

    //lista de gets para protocolo e despesa
    let [listaProtocolo, setListaProtocolo] = useState([]);
    let [listaTipoDespesa, setListaTipoDespesa] = useState([]);

    //popup pra selecionar protocolo
    let [showPopup2, setShowPopup2] = useState(false);

    //selecao de protocolo
    let [selectedProtocolo, setSelectedProtocolo] = useState(null);
    let [selectedProtocoloTitulo, setSelectedProtocoloTitulo] = useState("");

    //para alteracao
    let anoAlterar = useRef("");
    let mesAlterar = useRef("");
    let dataAlterar = useRef("");
    let tipoAlterar = useRef("");
    let protocoloAlterar = useRef("");
    let descricaoAlterar = useRef("");
    let valorAlterar = useRef("");

    //atrocidades
    const [showCadastro, setShowCadastro] = useState(false);

    //contexto da empresa
    let { emp, setEmp } = useContext(EmpContext);


    //funcao pra pegar os protocolos
    function carregarProtocolo() {
        fetch(`http://localhost:5000/protocolo/${emp.empId}`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r=> {
            return r.json()
        })
        .then(r=> {
            setListaProtocolo(r);
        })
    }

    //funcao pra carregar tipo de despesa
    function carregarTipoDespesa() {
        fetch(`http://localhost:5000/tipoDespesa/`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r=> {
            return r.json()
        })
        .then(r=> {
            setListaTipoDespesa(r);
        })
    };

    useEffect(() => {
        carregarProtocolo();
        carregarTipoDespesa()
    }, []);


    function handleSelectProtocolo(protocolo) {
        setSelectedProtocolo(protocolo.protId); // Define o protocolo selecionado
    }

    function confirmProtocolo() {
        if (selectedProtocolo) {
            // Encontrar o protocolo selecionado
            let protocolo = listaProtocolo.find(p => p.protId === selectedProtocolo);
    
            // Atualizar o título do protocolo no estado
            setSelectedProtocoloTitulo(protocolo.protTitulo);
    
            // Atualizar diretamente o valor no campo correspondente
            if (protocoloAlterar.current) {
                protocoloAlterar.current.value = protocolo.protId; // Atualiza o input ref
            }
    
            closePopup2();
        } else {
            alert("Por favor, selecione um protocolo antes de confirmar.");
        }
    }

    const handleSave = async (novoTipo) => {
        const dados = { tipDespDesc: novoTipo };

        const response = await fetch("http://localhost:5000/tipoDespesa", {
            mode: 'cors',
            credentials: 'include',
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(dados),
        });

        if (response.ok) {
            // Recarrega os tipos de despesa após salvar
            carregarTipoDespesa();
        }
    };

    let openPopup2 = () => {
        setShowPopup2(true);
    };

    let closePopup2 = () => {
        setShowPopup2(false);
    };

    function alterarDespesa(id){

        let ok = true;
    
        if (anoAlterar.current.value == "") {
            setErroAno(true);
            ok = false;
        } else {
            setErroAno(false);
        }
    
        if (mesAlterar.current.value == "") {
            setErroMes(true);
            ok = false;
        } else {
            setErroMes(false);
        }
    
        if (dataAlterar.current.value == "") {
            setErroData(true);
            ok = false;
        } else {
            setErroData(false);
        }
    
        if (tipoAlterar.current.value == "") {
            setErroTipo(true);
            ok = false;
        } else {
            setErroTipo(false);
        }
    
        if (descricaoAlterar.current.value == "") {
            setErroDescricao(true);
            ok = false;
        } else {
            setErroDescricao(false);
        }
    
        if (valorAlterar.current.value == "") {
            setErroValor(true);
            ok = false;
        } else {
            setErroValor(false);
        }
    
        if (msgRef.current) {
            msgRef.current.className = '';
            msgRef.current.innerHTML = '';
        }
    
        if (ok) {
            let despesa = {
                conId: id,
                compAno: anoAlterar.current.value,
                compMes: mesAlterar.current.value,
                conData: dataAlterar.current.value,
                tipDespId: tipoAlterar.current.value,
                protId: protocoloAlterar.current.value,
                conDescricao: descricaoAlterar.current.value,
                conValor: valorAlterar.current.value,
                empId: emp.empId
            };
    
            fetch(`http://localhost:5000/controleDespesa/alterarDespesaEsp`, {
                mode: 'cors',
                credentials: 'include',
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(despesa)
            })
            .then(r => {
                ok = r.status == 200;
                return r.json();
            })
            .then(r => {
                if (ok) {
                    router.push(`/admin/despesa/alteracao/${props.id}/alterarMes/${props.mesId}`);
                } else {
                    msgRef.current.className = "msgError";
                    msgRef.current.innerHTML = r.msg;
                }
            });
        } else {
            msgRef.current.className = "msgError";
            msgRef.current.innerHTML = "Preencha todos os campos";
        }

    }
    
    let despesa = 
    props.despesa != null ? 
        props.despesa 
    : 
        {  
            compAno: "", compMes: "", conData: "",  
        }

    let isAlteracao = despesa.conId != null;

    console.log(despesa.tipDespId)
    console.log(despesa.protId)

    return(
        <div className="container mt-1 d-flex justify-content-center">
            <div className="card mt-5 p-4 shadow" style={{ width: '800px' }}>
                <div ref={msgRef}></div>
                <h2 className="mb-4">Alterar Despesa</h2>
                <p className="text-muted mb-4">Campos com * são obrigatórios</p>

                <div className="row">
                    <div className="col-md-5 form-group mb-3">
                        <label htmlFor="nome">Ano*</label>
                        <input
                            defaultValue={despesa.compAno}
                            ref={anoAlterar}
                            type="text"
                            className={`form-control ${erroAno ? 'is-invalid' : ''}`}
                            readOnly // Torna o campo apenas leitura
                            placeholder="Digite o Título"
                        />
                    </div>

                    <div className="col-md-5 form-group mb-3">
                        <label htmlFor="status">Mês*</label>
                        <select
                            defaultValue={despesa.compMes}
                            ref={mesAlterar}
                            className={`form-control ${erroMes ? 'is-invalid' : ''}`}
                            disabled // Desabilita o select
                        >
                            <option value="0"></option>
                            <option value="1">Janeiro</option>
                            <option value="2">Fevereiro</option>
                            <option value="3">Março</option>
                            <option value="4">Abril</option>
                            <option value="5">Maio</option>
                            <option value="6">Junho</option>
                            <option value="7">Julho</option>
                            <option value="8">Agosto</option>
                            <option value="9">Setembro</option>
                            <option value="10">Outubro</option>
                            <option value="11">Novembro</option>
                            <option value="12">Dezembro</option>
                        </select>
                    </div>
                </div>

                <div className="col-md-3 form-group mb-3">
                    <label htmlFor="data">Data*</label>
                    <input
                        defaultValue={despesa.conData ? despesa.conData.slice(0, 10) : ""}
                        ref={dataAlterar}
                        type="date"
                        className={`form-control ${erroData ? 'is-invalid' : ''}`}
                        readOnly // Torna o campo apenas leitura
                    />
                </div>

                <div className="row">
                <div className="col-md-3 mb-3 position-relative">
                <label>Tipo de Despesa:</label>
                <select
                    name="tipo"
                    ref={tipoAlterar}
                    className={`form-control ${erroTipo ? 'is-invalid' : ''}`}
                    defaultValue={despesa?.tipDespId || ""}
                >
                    <option value="">Selecione</option>
                    {listaTipoDespesa.map((tipo) => (
                        <option key={tipo.tipDespId} value={tipo.tipDespId}>
                            {tipo.tipDespDesc} {/* Mostra a descrição */}
                        </option>
                    ))}
                </select>
                <button className="btn btn-link" onClick={() => setShowCadastro(true)}><i className="fas fa-plus"></i></button>
                {erroTipo && <small className="text-danger">Tipo é obrigatório</small>}

                    {showCadastro && (
                    <CadastroTipoDespesa
                        onClose={() => setShowCadastro(false)}
                        onSave={handleSave}
                    />
                )}
            </div>

                <div className="col-md-3 mb-3">
                        <label>Protocolo:</label>
                        <button className="btn btn-primary w-100" onClick={openPopup2} defaultValue={despesa.protId} ref={protocoloAlterar}>
                            {selectedProtocoloTitulo ? `Protocolo: ${selectedProtocoloTitulo}` : "Selecionar Protocolo"}
                        </button>
                        {selectedProtocoloTitulo && (
                            <small className="text-muted">Selecionado: {selectedProtocoloTitulo}</small>
                        )}
                    </div>
                </div>

                    {showPopup2 && (
                            <div className="popup-overlay2">
                            <div className="popup2">
                                <aside ref={msgRef}></aside>
                    
                                <div className="popup-title2">Selecione o protocolo</div>
                    
                                <div className="popup-content2">
                                    {/* Lista de protocolos */}
                                    {listaProtocolo.length === 0 ? (
                                    <p className="text-center">Nenhum registro disponível.</p>
                                     ) : (
                                    <ul className="protocol-list">
                                        {listaProtocolo.map((protocolo, index) => (
                                            <li
                                            key={index}
                                            onClick={() => handleSelectProtocolo(protocolo)}
                                            className={`protocol-item ${selectedProtocolo === protocolo.protId ? "selected" : ""}`}
                                            >
                                                {protocolo.protId} | {protocolo.protTitulo}
                                            </li>
                                        ))}
                                    </ul>
                                     )}
                                </div>
                    
                                <div className="popup-buttons2">
                                    <button className="btn btn-danger" onClick={closePopup2}>Cancelar</button>
                                    <button className="btn btn-primary" onClick={confirmProtocolo}>Confirmar</button>
                                </div>
                            </div>    
                        </div>
                    )}
                
                <div className="row">
                    <div className="col-md-12 mb-3">
                        <label>Descrição:</label>
                        <input type="text" name="descricao" defaultValue={despesa.conDescricao}  className={`form-control ${erroDescricao ? 'is-invalid' : ''}`} ref={descricaoAlterar}/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-2 mb-3">
                        <label>Valor:</label>
                        <input type="number" name="valor" defaultValue={despesa.conValor} className={`form-control ${erroValor ? 'is-invalid' : ''}`} ref={valorAlterar}/>
                    </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                    <button
                        onClick={() => alterarDespesa(despesa.conId)}
                        className="btn btn-primary"
                    >
                    Alterar
                    </button>
                    <Link href={`/admin/despesa/alteracao/${props.id}/alterarMes/${props.mesId}`} className="btn btn-outline-secondary">Voltar</Link>
                </div>
            </div>
        </div>
    );
}