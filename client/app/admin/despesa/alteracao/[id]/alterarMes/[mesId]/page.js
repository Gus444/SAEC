'use client'
import MontaTabelaDespesas from "@/app/components/montaTabelaDespesas";
import EmpContext from "@/app/context/empContext";
import UserContext from "@/app/context/userContext";
import { useContext, useEffect, useState, useRef } from "react";


export default function alterarMes({params: {id, mesId}}){

    let [listaDespesas, setListaDespesas] = useState([]);
    let { emp, setEmp } = useContext(EmpContext);
    let { user, setUser} = useContext(UserContext);
    let msgRef = useRef(null);
    let timeoutId;

    function carregarDespesas(id, mesId) {

        fetch(`http://localhost:5000/controleDespesa/obter/${id}/${emp.empId}/${mesId}`, {
            credentials: "include"
        })
        .then(r=> {
            return r.json();
        })
        .then(r=> {
            console.log(r);
            const listaDespesaComRS = r.map(item => ({
                ...item,
                valor: `R$ ${parseFloat(item.valor).toFixed(2).replace('.', ',')}`, // Formata o valor
            }));
            
            setListaDespesas(listaDespesaComRS);
        })
    }

    useEffect(() => {
        carregarDespesas(id, mesId);
    }, [id, mesId])

    async function excluirDespesa(despesaId) {

        msgRef.current.className = ''
        msgRef.current.innerHTML = ''

        if(confirm("Tem certeza que deseja excluir este registro?")) {
            if(id > 0) {
                let ok = false;
                fetch(`http://localhost:5000/controleDespesa/excluir/${despesaId}`, {
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
                        carregarDespesas(id, mesId);

                        timeoutId = setTimeout(() => {
                            if (msgRef.current) {
                                msgRef.current.innerHTML = '';
                                msgRef.current.className = '';
                            }
                        }, 5000);
                    }
                    else{
                        msgRef.current.className = "msgError";
                        msgRef.current.innerHTML = r.msg;

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

    return(
        <div>   
            <h1>Despesas do mes({mesId}) ano ({id})</h1>
            <div ref={msgRef}>

            </div>
            <div>
                <MontaTabelaDespesas alteracao={`/admin/despesa/alteracao/${id}/alterarMes/${mesId}/alterarDespesa`}  exclusao={excluirDespesa} lista={listaDespesas} cabecalhos={["código","descricão","data","valor","protocolo","tipo"]} propriedades={["id","descricao","data","valor", "protocolo", "tipoDespesa"]} campoExclusao="id" ></MontaTabelaDespesas>
            </div>
        </div>

    )
}
