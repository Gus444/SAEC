'use client'
import FormAlterarDespesa from "@/app/components/FormAlterarDespesa";
import EmpContext from "@/app/context/empContext";
import UserContext from "@/app/context/userContext";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";


export default function AlterarDespesa({params: {id, mesId, desId}}) {

    let [despesa, setDespesa] = useState(null);
    let { emp, setEmp } = useContext(EmpContext);
    let { user, setUser} = useContext(UserContext);

    function carregarDespesa(id) {

        fetch(`http://localhost:5000/controleDespesa/obterDespesa/${id}/${emp.empId}/${mesId}/${desId}`, {
            credentials: "include"
        })
        .then(r=> {
            return r.json();
        })
        .then(r=> {
            console.log(r);
            setDespesa(r);
        })
    }

    useEffect(() => {
        carregarDespesa(id);
    }, [])

    return (
        <div>
            <h1>Alteração de Despesa({desId})</h1>
            {
                despesa == null ?
                    "Carregando..."
                :
                    <FormAlterarDespesa despesa={despesa} id={id} mesId={mesId}></FormAlterarDespesa>
            }
        </div>
    )

}