'use client'
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react"
import EmpContext from '@/app/context/empContext';
import MontaTabela from "@/app/components/montaTabela";

export default function comunicacaoAdmin(){

    let msgRef = useRef(null)

    let {emp, setEmp} = useContext(EmpContext)
    let empresaLogada
    let [listaProtocolo, setListaProtocolo] = useState([]);
    useEffect((e) => {
        carregarProtocolo();
    }, [])

    function carregarProtocolo() {
        fetch("http://localhost:5000/protocolo", {
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

    async function excluirProtocolo(id){

        msgRef.current.className = ''
        msgRef.current.innerHTML = ''

            if(confirm("Tem certeza que deseja excluir este registro?")) {
                if(id > 0) {
                    let ok = false;
                    fetch(`http://localhost:5000/protocolo/excluir/${id}`, {
                        mode: 'cors',
                        credentials: 'include',
                        method: "DELETE",
                    })
                    .then(r=> {
                        ok = r.status == 200;
                        return r.json();
                    })
                    .then(r=> {
                        if(ok) {
                            msgRef.current.className = "msgSucess";
                            msgRef.current.innerHTML = r.msg;
                            carregarProtocolo();

                            setTimeout(() => {
                                msgRef.current.innerHTML = '';
                                msgRef.current.className = '';
                            }, 5000);
                        }
                        else{
                            msgRef.current.className = "msgError";
                            msgRef.current.innerHTML = r.msg;

                            setTimeout(() => {
                                msgRef.current.innerHTML = '';
                                msgRef.current.className = '';
                            }, 5000);
                        }
                    })
                }
            }  
    }    

    return (
        <div>
            <h1>Lista de protocolos</h1>
            <div>
                <Link href="/admin/protocolo/cadastro" style={{marginBottom: "15px"}} className="btn btn-primary">Cadastrar protocolo</Link>
            </div>
            <div ref={msgRef}>

            </div>
            <div>
                <MontaTabela alteracao={""}  exclusao={excluirProtocolo} exibir={"/admin/protocolo/exibir"} lista={listaProtocolo} cabecalhos={["id","Titulo", "Tipo", "Data", "Usuario", "Empresa"]} propriedades={['protId', 'protTitulo', 'protTipo', 'protData', "usuario.usuNome", "empresa.empNome"]} ></MontaTabela>
            </div>
        </div>
    )
}