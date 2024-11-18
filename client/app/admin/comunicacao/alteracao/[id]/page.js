'use client'
import FormComunicacao from "@/app/components/formComunicacao";
import { useContext, useEffect, useState } from "react";

export default function AlterarProtocolo({params: {id}}) {

    let [comunicacao, setComunicacao] = useState(null);
    let [docsComunicacao, setDocsComunicacao] = useState(null);
    
    function carregarComunicacao(id) {

        fetch(`http://localhost:5000/comunicacao/obter/${id}`, {
            credentials: "include"
        })
        .then(r=> {
            return r.json();
        })
        .then(r=> {
            console.log(r);
            setComunicacao(r);
        })
    }

    useEffect(() => {
        carregarComunicacao(id);
    }, [])

    function carregarDocsComunicacao() {
        fetch(`http://localhost:5000/docsComunicacao/obter/${id}`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r=> {
            return r.json()
        })
        .then(r=> {
            setDocsComunicacao(r);
        })
    }

    useEffect(() => {
        carregarDocsComunicacao(id);
    }, [])

    return (
        <div>
            <h1>Alteração de Comunicação ({id})</h1>
            {
                comunicacao == null ?
                    "Carregando..."
                :
                    <FormComunicacao comunicacao={comunicacao} docsComunicacao={docsComunicacao} ></FormComunicacao>
            }
            
        </div>
    )

}