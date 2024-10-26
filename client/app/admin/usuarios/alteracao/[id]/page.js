'use client'
import FormUsuario from "@/app/components/formUsuario";
import { useEffect, useState } from "react";


export default function AlteracaoUsuario({params: {id}}) {

    let [usuario, setUsuario] = useState(null);

    function carregarUsuario(id) {

        fetch(`http://localhost:5000/usuarios/obter/${id}`, {
            credentials: "include"
        })
        .then(r=> {
            return r.json();
        })
        .then(r=> {
            console.log(r);
            setUsuario(r);
        })
    }

    useEffect(() => {
        carregarUsuario(id);
    }, [])

    return (
        <div>
            <h1>Alteração de Usuários ({id})</h1>
            {
                usuario == null ?
                    "Carregando..."
                :
                    <FormUsuario usuario={usuario} ></FormUsuario>
            }
            
        </div>
    )

}