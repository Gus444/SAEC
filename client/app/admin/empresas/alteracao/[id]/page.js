'use client'
import FormEmpresa from "@/app/components/formEmpresa";
import { useEffect, useState } from "react";


export default function AlteracaoEmpresa({params: {id}}) {

    let [empresa, setEmpresa] = useState(null);

    function carregarEmpresa(id) {

        fetch(`http://localhost:5000/empresa/obter/${id}`, {
            credentials: "include"
        })
        .then(r=> {
            return r.json();
        })
        .then(r=> {
            console.log(r);
            setEmpresa(r);
        })
    }

    useEffect(() => {
        carregarEmpresa(id);
    }, [])

    return (
        <div>
            <h1>Alteração de Empresa ({id})</h1>
            {
                empresa == null ?
                    "Carregando..."
                :
                    <FormEmpresa empresa={empresa} ></FormEmpresa>
            }
            
        </div>
    )

}