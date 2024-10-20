'use client'
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react"
import EmpContext from '@/app/context/empContext';
import MontaTabela from "@/app/components/montaTabela";

export default function comunicacaoAdmin(){

    let msgRef = useRef(null)

    let {emp, setEmp} = useContext(EmpContext)
    let empresaLogada
    let [listaComunicacao, setListaComunicacao] = useState([]);
    useEffect((e) => {
        carregarComunicacao();
    }, [])

    function carregarComunicacao() {
        fetch("http://localhost:5000/comunicacao", {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r=> {
            return r.json()
        })
        .then(r=> {
            setListaComunicacao(r);
        })
    }

    console.log(listaComunicacao)

    return (
        <div>
            <h1>Lista de comunicação</h1>
            <div>
                <Link href="/admin/comunicacao/cadastro" style={{marginBottom: "15px"}} className="btn btn-primary">Cadastrar comunicação</Link>
            </div>
            <div ref={msgRef}>

            </div>
            <div>
                <MontaTabela alteracao={""}  exclusao={""} lista={listaComunicacao} cabecalhos={["id","Titulo", "Canal", "Data", "Hora", "Usuario", "Empresa"]} propriedades={['comId', 'comTitulo', 'comCanal', 'comData', 'comHora', "usuario.usuNome", "empresa.empNome"]} ></MontaTabela>
            </div>
        </div>
    )
}