'use client'
import FormProtocolo from "@/app/components/formProtocolo";
import { useContext, useEffect, useState } from "react";

export default function AlterarProtocolo({params: {id}}) {

    let [protocolo, setProtocolo] = useState(null);
    let [docsProtocolo, setDocsProtocolo] = useState(null);
    
    function carregarProtocolo(id) {

        fetch(`http://localhost:5000/protocolo/obter/${id}`, {
            credentials: "include"
        })
        .then(r=> {
            return r.json();
        })
        .then(r=> {
            console.log(r);
            setProtocolo(r);
        })
    }

    useEffect(() => {
        carregarProtocolo(id);
    }, [])

    function carregarDocsProtocolo() {
        fetch(`http://localhost:5000/docsProtocolo/obter/${id}`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r=> {
            return r.json()
        })
        .then(r=> {
            setDocsProtocolo(r);
        })
    }

    useEffect(() => {
        carregarDocsProtocolo(id);
    }, [])

    return (
        <div>
            <h1>Alteração de Protocolo ({id})</h1>
            {
                protocolo == null ?
                    "Carregando..."
                :
                    <FormProtocolo protocolo={protocolo} docsProtocolo={docsProtocolo} ></FormProtocolo>
            }
            
        </div>
    )

}