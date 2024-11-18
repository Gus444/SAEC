'use client'
import { useEffect, useState, useContext } from "react";
import EmpContext from "@/app/context/empContext";
import UserContext from "@/app/context/userContext";
import Link from "next/link";

export default function ExibirFaturamento({ params: {id} }) {
 
    let [meses, setMeses] = useState([]);
    let { emp, setEmp } = useContext(EmpContext);

    useEffect((e) => {
        carregarFaturamento();
    }, [])

    function carregarFaturamento() {
        fetch(`http://localhost:5000/faturamento/obter/${id}/${emp.empId}`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r=> {
            return r.json()
        })
        .then(r=> {
            setFaturamento(r);
        })
    }

    console.log(id)

    return (
            <div className="container mt-5">
            <h2 className="text-center">Faturamento de {faturamento.length > 0 ? faturamento[0].ano : 'Carregando...'}</h2>
            {faturamento.length > 0 && (
                <div className="d-flex justify-content-between mb-3">
                    <div><strong>Empresa:</strong> {faturamento[0].empresa}</div>
                    <div><strong>Usuário:</strong> {faturamento[0].usuario}</div>
                </div>
            )}

            <table className="table table-striped table-dark table-hover table-bordered">
                <thead className="table-primary text-center">
                    <tr>
                        <th>Mês</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {faturamento.map((item, index) => (
                        <tr key={index}>
                            <td>{item.mes}</td>
                            <td>R${item.valor}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <Link type="button" className="btn btn-secondary mt-3" href="/admin/faturamento">Voltar</Link>
        </div>
    );
}