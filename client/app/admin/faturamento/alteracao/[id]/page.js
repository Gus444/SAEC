'use client'
import FormFaturamento from "@/app/components/formFaturamento";
import EmpContext from "@/app/context/empContext";
import UserContext from "@/app/context/userContext";
import { useContext, useEffect, useState } from "react";


export default function AlterarFaturamento({params: {id}}) {

    let [faturamento, setFaturamento] = useState(null);
    let { emp, setEmp } = useContext(EmpContext);
    let { user, setUser} = useContext(UserContext);

    function carregarFaturamento(id) {

        fetch(`http://localhost:5000/faturamento/obter/${id}/${emp.empId}`, {
            credentials: "include"
        })
        .then(r=> {
            return r.json();
        })
        .then(r=> {
            console.log(r);
            setFaturamento(r);
        })
    }

    useEffect(() => {
        carregarFaturamento(id);
    }, [])

    return (
        <div>
            <h1>Alteração de Faturamento ({id})</h1>
            {
                faturamento == null ?
                    "Carregando..."
                :
                    <FormFaturamento faturamento={faturamento} ></FormFaturamento>
            }
            
        </div>
    )

}