'use client'
import ListaMeses from "@/app/components/listaMeses";
import EmpContext from "@/app/context/empContext";
import UserContext from "@/app/context/userContext";
import { useContext, useEffect, useState } from "react";


export default function AlterarDespesa({params: {id}}){

    let [listaMeses, setListaMeses] = useState(null);
    let { emp, setEmp } = useContext(EmpContext);
    let { user, setUser} = useContext(UserContext);

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

    useEffect(() => {
        carregarDespesas(id);
    }, [])
    
    return(
        <div>   
            <h1>Meses cadastrados({id})</h1>
            {
                listaMeses == null ?
                    "Carregando..."
                :
                    <ListaMeses alteracao={`/admin/despesa/alteracao/${id}/alterarMes`}  exclusao={""} exibir={""} lista={listaMeses} cabecalhos={["Meses","Valor Total"]} propriedades={["nomeMes", "totalDespesa"]} campoExclusao="mes" ></ListaMeses>
            }
        </div>

    )
}