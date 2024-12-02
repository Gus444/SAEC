'use client'
import ListaMeses from "@/app/components/listaMeses";
import EmpContext from "@/app/context/empContext";
import UserContext from "@/app/context/userContext";
import { useContext, useEffect, useState, useRef } from "react";


export default function AlterarDespesa({params: {id}}){

    let [listaMeses, setListaMeses] = useState(null);
    let { emp, setEmp } = useContext(EmpContext);
    let { user, setUser} = useContext(UserContext);
    let msgRef = useRef(null);

    function obterNomeMes(numeroMes) {// funcao para alterar oque vem da lista para exibir o nome ao inves do numero do mes
        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        return meses[numeroMes - 1] || "Mês inválido";
    }

    function carregarDespesas(id) {
        fetch(`http://localhost:5000/controleDespesa/obter/${id}/${emp.empId}`, {
            credentials: "include"
        })
        .then(r => r.json())
        .then(r => {
            const listaDespesaComRSENomes = r.map(item => ({
                ...item,
                totalDespesa: `R$ ${parseFloat(item.totalDespesa).toFixed(2).replace('.', ',')}`, // Formata o valor
                nomeMes: obterNomeMes(item.mes) // Adiciona o nome do mês
            }));
            setListaMeses(listaDespesaComRSENomes);
        });
    }

    async function excluirDespesaMes(mes) {

        msgRef.current.className = '';
        msgRef.current.innerHTML = '';
    
        if (confirm("Tem certeza que deseja excluir este período? ATENÇÃO VOCE ESTA PRESTES A APAGAR TODOS OS LANÇAMENTOS FEITOS NESTE MÊS")) {
            if (id) { 
                let ok = false;
    
                fetch(`http://localhost:5000/controleDespesa/excluirMes/${id}/${emp.empId}/${mes}`, {
                    mode: 'cors',
                    credentials: 'include',
                    method: "DELETE",
                })
                .then(r => {
                    ok = r.status === 200;
                    return r.json();
                })
                .then(r => {
                    if (ok) {
                        msgRef.current.className = "msgSucess";
                        msgRef.current.innerHTML = r.msg;
                        carregarDespesas(id); // Recarrega os dados após exclusão
    
                        setTimeout(() => {
                            if (msgRef.current) {
                                msgRef.current.innerHTML = '';
                                msgRef.current.className = '';
                            }
                        }, 5000);
                    } else {
                        msgRef.current.className = "msgError";
                        msgRef.current.innerHTML = r.msg;
    
                        setTimeout(() => {
                            if (msgRef.current) {
                                msgRef.current.innerHTML = '';
                                msgRef.current.className = '';
                            }
                        }, 5000);
                    }
                })
                .catch(err => {
                    console.error("Erro ao excluir o período:", err);
                    msgRef.current.className = "msgError";
                    msgRef.current.innerHTML = "Erro ao excluir o período.";
                });
            } else {
                console.error("Ano ou ID da empresa ausente.");
                msgRef.current.className = "msgError";
                msgRef.current.innerHTML = "Não foi possível excluir o período: informações ausentes.";
            }
        }
    }

    useEffect(() => {
        carregarDespesas(id);
    }, [])
    
    return(
        <div>   
            <h1>Meses cadastrados({id})</h1>
            <div ref={msgRef}>

            </div>
            {
                listaMeses == null ?
                    "Carregando..."
                :
                    <ListaMeses alteracao={`/admin/despesa/alteracao/${id}/alterarMes`}  exclusao={excluirDespesaMes} lista={listaMeses} cabecalhos={["Meses","Valor Total"]} propriedades={["nomeMes", "totalDespesa"]} campoExclusao="mes" ></ListaMeses>
            }
        </div>

    )
}