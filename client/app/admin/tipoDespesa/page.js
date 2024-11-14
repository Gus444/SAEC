'use client'
import Link from "next/link"
import { useContext, useEffect, useRef, useState } from "react"
import EmpContext from '@/app/context/empContext';
import { useRouter } from "next/navigation";
import MontaTabelaTD from "@/app/components/montaTabelaTD";


export default function tipoDespesaAdmin(){

    let msgRef = useRef(null);

    let {emp, setEmp} = useContext(EmpContext)
    let [listaTipoDespesa, setListaTipoDespesa] = useState([])
    let [loading, setLoading] = useState(true)

    const [showPopup, setShowPopup] = useState(false);//cadastrar tipdespesa pelo popup
    const openPopup = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    let nomeRef = useRef(null);

    function cadastrarTipoDespesa(){

        let nomeValue = nomeRef.current.value

        let dados = {
            tipDespDesc: nomeValue
        }

        if (msgRef.current) {
            msgRef.current.className = '';
            msgRef.current.innerHTML = '';
        }

        if(nomeValue != ""){
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
                }
                else{
                    if (msgRef.current) {
                        msgRef.current.className = "msgError";
                        msgRef.current.innerHTML = r.msg;
                    }
                }
            })
        }
        else{
            if (msgRef.current) {
                msgRef.current.className = 'msgError';
                msgRef.current.innerHTML = 'Preencha o nome do tipo de despesa';
            }
        }
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

                        <aside ref={msgRef}>
                        </aside>

                            <div className="popup-title">Cadastrar Tipo Despesa</div>
                            <div className="popup-content">

                            
                            <br></br>    
                                <div>
                                    <label>Nome:</label>
                                    <input className="form-control" type="text" ref={nomeRef} id="nome" placeholder="Digite o tipo de despesa" />
                                </div>
                            </div>
                            <br></br>

                            <div className="popup-buttons">
                                <a className="btn btn-danger" id="fechar" onClick={closePopup}>Cancelar</a>
                                <a className="btn btn-primary" id="criarSala" onClick={cadastrarTipoDespesa}>Confirmar</a>
                            </div>
                        </div>    
                    </div>
            )}

            <div ref={msgRef}>

            </div>
            <div>
                <MontaTabelaTD alteracao={"/admin/tipoDespesa/alteracao"}  exclusao={excluirTipoDespesa} lista={listaTipoDespesa} cabecalhos={["id","Titulo"]} propriedades={['tipDespId', 'tipDespDesc']} ></MontaTabelaTD>
            </div>
        </div>
    )
}