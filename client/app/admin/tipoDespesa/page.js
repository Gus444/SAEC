'use client'
import Link from "next/link"
import { useContext, useEffect, useRef, useState } from "react"
import EmpContext from '@/app/context/empContext';
import { useRouter } from "next/navigation";
import MontaTabelaTD from "@/app/components/montaTabelaTD";


export default function tipoDespesaAdmin(){

    let msgRef = useRef(null);
    let msgRefPopUp = useRef(null);
    let nomeRef = useRef(null);

    let {emp, setEmp} = useContext(EmpContext)
    let [listaTipoDespesa, setListaTipoDespesa] = useState([])
    let [loading, setLoading] = useState(true);
    let [erroNome, setErroNome] = useState(false);

    //para identificar se a popup esta no modo cadastro ou alteracao
    let [editando, setEditando] = useState(false);
    let [idEdicao, setIdEdicao] = useState(false);

    const [showPopup, setShowPopup] = useState(false);//cadastrar tipdespesa pelo popup
    const openPopup = (modo ='cadastrar', id = null) => {
        setShowPopup(true);
        setEditando(modo === 'editar');
        setIdEdicao(id);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    useEffect(() => {
        if (!nomeRef.current) return; // Certifique-se de que o `ref` existe antes de acessá-lo
    
        if (editando && idEdicao) {
            const tipoDespesa = listaTipoDespesa.find(item => item.tipDespId === idEdicao);
            if (tipoDespesa) {
                nomeRef.current.value = tipoDespesa.tipDespDesc;
            }
        } else if (!editando) {
            nomeRef.current.value = ''; // Limpar no modo cadastro
        }
    }, [editando, idEdicao, showPopup]);

    function cadastrarTipoDespesa(){

        let nomeValue = nomeRef.current.value

        let dados = {
            tipDespDesc: nomeValue
        }

        if (msgRefPopUp.current) {
            msgRefPopUp.current.className = '';
            msgRefPopUp.current.innerHTML = '';
        }

        if(nomeValue != ""){
            setErroNome(false);
            let ok = false
            fetch('http://localhost:5000/tipoDespesa', {
                mode: 'cors',
                credentials: 'include',
                method: "POST",
                headers:{
                    "Content-type": "application/json",
                },
                body: JSON.stringify(dados)
            })
            .then(r => {
                ok = r.status == 201;
                return r.json();
            })
            .then(r => { 
                if(ok) {
                    closePopup()
                    carregarTipoDespesa();
                    if(msgRef.current){
                        msgRef.current.className = "msgSucess";
                        msgRef.current.innerHTML = r.msg;
                    }
                }
                else{
                    if (msgRefPopUp.current) {
                        msgRefPopUp.current.className = "msgError";
                        msgRefPopUp.current.innerHTML = r.msg;
                    }
                }
            })
        }
        else{
            if (msgRefPopUp.current) {
                setErroNome(true);
                msgRefPopUp.current.className = 'msgError';
                msgRefPopUp.current.innerHTML = 'Preencha o nome do tipo de despesa';
            }
        }
    }

    async function alterarTipoDespesa(id) {
        openPopup('editar', id);
    }

    async function confirmarAlteracao() {
        const nomeValue = nomeRef.current.value;
    
        if (!nomeValue) {
            if (msgRefPopUp.current) {
                msgRefPopUp.current.className = 'msgError';
                msgRefPopUp.current.innerHTML = 'Preencha o nome do tipo de despesa';
            }
            return;
        }
    
        const dados = {
            tipDespId: idEdicao,
            tipDespDesc: nomeValue
        };
    
        let ok = false;
    
        fetch(`http://localhost:5000/tipoDespesa/${idEdicao}`, {
            mode: 'cors',
            credentials: 'include',
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(dados),
        })
        .then(r => {
            ok = r.status === 200;
            return r.json();
        })
        .then(r => {
            if (ok) {
                carregarTipoDespesa();
                closePopup();
                if (msgRef.current) {
                    msgRef.current.className = "msgSucess";
                    msgRef.current.innerHTML = r.msg;
                }
            } else {
                if (msgRefPopUp.current) {
                    msgRefPopUp.current.className = "msgError";
                    msgRefPopUp.current.innerHTML = r.msg;
                }
            }
        });
    }

    async function excluirTipoDespesa(id){

        if (msgRef.current) {
            msgRef.current.className = '';
            msgRef.current.innerHTML = '';
        }

            if(confirm("Tem certeza que deseja excluir este registro?")) {
                if(id > 0) {
                    let ok = false;
                    fetch(`http://localhost:5000/tipoDespesa/excluir/${id}`, {
                        mode: 'cors',
                        credentials: 'include',
                        method: "DELETE",
                    })
                    .then(r=> {
                        ok = r.status == 200;
                        return r.json();
                    })
                    .then(r=> {
                        carregarTipoDespesa()
                        if (msgRef.current) {
                            if (ok) {
                                msgRef.current.className = "msgSucess";
                                msgRef.current.innerHTML = r.msg;
                            } else {
                                msgRef.current.className = "msgError";
                                msgRef.current.innerHTML = r.msg;
                            }
        
                            timeoutId = setTimeout(() => {
                                if (msgRef.current) {
                                    msgRef.current.innerHTML = '';
                                    msgRef.current.className = '';
                                }
                            }, 5000);
                        }
                    })
                }
            }  
    }    

    let timeoutId
    useEffect(() => {
        carregarTipoDespesa();

        // Limpa o timeout quando o componente desmonta
        return () => {
            clearTimeout(timeoutId);
        };
    }, []);
    const router = useRouter();

    function carregarTipoDespesa() {
        fetch(`http://localhost:5000/tipoDespesa`, {
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
    }

    return (
        <div>
            <h1>Lista de Tipos de Despesa</h1>
            <div>
                <button onClick={openPopup} style={{marginBottom: "15px"}} className="btn btn-primary">Cadastrar Tipo de Despesa</button>
            </div>
            {showPopup && (
                    <div className="popup-overlay">
                        <div className="popup">

                        <aside ref={msgRefPopUp}>
                        </aside>

                            <div className="popup-title">Cadastrar Tipo Despesa</div>
                            <div className="popup-content">

                            
                            <br></br>    
                                <div>
                                    <label>*Nome:</label>
                                    <input className={`form-control ${erroNome ? 'is-invalid' : ''}`} onChange={() => setErroNome(false)} type="text" ref={nomeRef}  id="nome" placeholder="Digite o tipo de despesa" />
                                </div>
                            </div>
                            <br></br>

                            <div className="popup-buttons">
                                <a className="btn btn-danger" id="fechar" onClick={closePopup}>Cancelar</a>
                                <a className="btn btn-primary" id="cadastrar" onClick={editando ? confirmarAlteracao : cadastrarTipoDespesa}>{editando ? 'Alterar' : 'Confirmar'}</a>
                            </div>
                        </div>    
                    </div>
            )}

            <div ref={msgRef}>

            </div>
            <div>
                <MontaTabelaTD alteracao={alterarTipoDespesa}  exclusao={excluirTipoDespesa} lista={listaTipoDespesa} cabecalhos={["id","Titulo"]} propriedades={['tipDespId', 'tipDespDesc']} ></MontaTabelaTD>
            </div>
        </div>
    )
}